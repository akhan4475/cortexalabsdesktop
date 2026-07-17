#!/usr/bin/env bash
# Usage: bash activate.sh <repo-folder-name> [prefix]
#        bash activate.sh --deactivate <repo-folder-name>
#
# Supports three repo layouts detected automatically:
#   "root"      — skills/ agents/ at repo root (agrici style)
#   "dotclaude" — .claude/skills/ .claude/agents/ .claude/commands/ (craig style)
#   "geodir"    — single skill dir at root (e.g. geo/SKILL.md), agents/ at root (zubair style)
#
# Multiple repos with different prefixes can coexist simultaneously.
# Only deactivates a repo if its prefix would clash with the incoming one.
set -euo pipefail

REPOS_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"
COMMANDS_DIR="$HOME/.claude/commands"
ACTIVE_FILE="$REPOS_DIR/.active"  # format: one "repo:layout:prefix" per line

# ── Usage ─────────────────────────────────────────────────────────────────────
if [ $# -eq 0 ]; then
  echo "Usage: bash activate.sh <repo-folder-name> [prefix]"
  echo "       bash activate.sh --deactivate <repo-folder-name>"
  echo ""
  echo "Available repos:"
  for d in "$REPOS_DIR"/*/; do [ -d "$d" ] && echo "  $(basename "$d")"; done
  echo ""
  if [ -f "$ACTIVE_FILE" ]; then
    echo "Currently active:"
    while IFS=: read -r repo layout prefix; do
      echo "  $repo  (prefix: $prefix, layout: $layout)"
    done < "$ACTIVE_FILE"
  else
    echo "Currently active: none"
  fi
  exit 1
fi

# ── Deactivate command ────────────────────────────────────────────────────────
if [ "$1" = "--deactivate" ]; then
  [ $# -ge 2 ] || { echo "Usage: --deactivate <repo-folder-name>"; exit 1; }
  DEL_TARGET="$2"
  if [ ! -f "$ACTIVE_FILE" ]; then
    echo "$DEL_TARGET is not active."
    exit 0
  fi
  FOUND=false
  NEWLINES=""
  while IFS=: read -r repo layout prefix; do
    if [ "$repo" = "$DEL_TARGET" ]; then
      FOUND=true
      echo "Deactivating $repo (prefix: $prefix, layout: $layout)"
      if [ "$layout" = "root" ] || [ "$layout" = "geodir" ]; then
        rm -rf "$SKILLS_DIR/${prefix}-seo" 2>/dev/null || true
        rm -rf "$SKILLS_DIR/${prefix}-seo-"* 2>/dev/null || true
        for f in "$AGENTS_DIR"/${prefix}-*.md; do [ -f "$f" ] && rm -f "$f"; done
      else
        for d in "$SKILLS_DIR/${prefix}-"*/; do [ -d "$d" ] && rm -rf "$d"; done
        for f in "$AGENTS_DIR/${prefix}-"*.md; do [ -f "$f" ] && rm -f "$f"; done
        for f in "$COMMANDS_DIR/${prefix}-"*.md; do [ -f "$f" ] && rm -f "$f"; done
      fi
      echo "Removed ${prefix} skills, agents, commands"
    else
      NEWLINES="${NEWLINES}${repo}:${layout}:${prefix}"$'\n'
    fi
  done < "$ACTIVE_FILE"
  if [ "$FOUND" = false ]; then
    echo "$DEL_TARGET is not in the active list."
    exit 1
  fi
  if [ -z "$NEWLINES" ]; then
    rm -f "$ACTIVE_FILE"
  else
    printf '%s' "$NEWLINES" > "$ACTIVE_FILE"
  fi
  echo "Done."
  exit 0
fi

# ── Install ───────────────────────────────────────────────────────────────────
TARGET="$1"
REPO_PATH="$REPOS_DIR/$TARGET"

if [ ! -d "$REPO_PATH" ]; then
  echo "Repo not found: $REPO_PATH"
  exit 1
fi

# Derive prefix from folder name if not provided
if [ $# -ge 2 ]; then
  PREFIX="$2"
else
  PREFIX="${TARGET##*-}"
fi

# Detect layout
GEO_SKILL_DIR=""
GEO_SKILL_NAME=""
LAYOUT="root"
if [ -d "$REPO_PATH/.claude/skills" ]; then
  LAYOUT="dotclaude"
elif ! [ -d "$REPO_PATH/skills" ]; then
  # Check for single named skill dir at root (geodir layout)
  for _d in "$REPO_PATH"/*/; do
    [ -d "$_d" ] || continue
    _dname=$(basename "$_d")
    case "$_dname" in
      .git|agents|scripts|schema|docs|examples|assets|venv|.venv|references) continue ;;
    esac
    if [ -f "$_d/SKILL.md" ]; then
      LAYOUT="geodir"
      GEO_SKILL_DIR="$_d"
      GEO_SKILL_NAME="$_dname"
      break
    fi
  done
fi
echo "Prefix: $PREFIX  Layout: $LAYOUT"

# Check active list
if [ -f "$ACTIVE_FILE" ]; then
  while IFS=: read -r repo layout prefix; do
    if [ "$repo" = "$TARGET" ]; then
      echo "$TARGET is already active."
      exit 0
    fi
    # If same prefix from different repo → deactivate that repo first
    if [ "$prefix" = "$PREFIX" ] && [ "$repo" != "$TARGET" ]; then
      echo "Prefix '$PREFIX' already used by $repo — deactivating it first"
      bash "$0" --deactivate "$repo"
      break
    fi
  done < "$ACTIVE_FILE"
fi

echo "Installing: $TARGET as prefix '$PREFIX'"
mkdir -p "$SKILLS_DIR" "$AGENTS_DIR" "$COMMANDS_DIR"

# ── Helper: root-layout skill install (seo-prefix aware) ─────────────────────
install_skill_seo() {
  local src_dir="$1"
  local original_name="$2"
  local prefix="$3"
  local new_name="${prefix}-${original_name}"
  local dest="$SKILLS_DIR/$new_name"

  mkdir -p "$dest"
  cp -r "$src_dir"* "$dest/"

  local skill_md="$dest/SKILL.md"
  [ -f "$skill_md" ] || return

  # Fix frontmatter name field (handles both seo-* and geo-* sub-skill conventions)
  sed -i \
    -e "s|^name: seo$|name: ${prefix}-seo|" \
    -e "s|^name: seo-|name: ${prefix}-seo-|" \
    -e "s|^name: geo-|name: ${prefix}-geo-|" \
    "$skill_md"

  # Fix slash-command references (placeholder prevents double-replace)
  sed -i \
    -e "s|/seo-|/SEOPFX-|g" \
    -e "s|/seo |/SEOPFX |g" \
    -e "s|/seo\b|/SEOPFX|g" \
    "$skill_md"

  # Fix bare sub-skill references
  local sub_skills="audit backlinks cluster competitor-pages content-brief content dataforseo drift ecommerce flow geo google hreflang image-gen images local maps page plan programmatic schema sitemap sxo technical"
  for sub in $sub_skills; do
    sed -i "s|\bseo-${sub}\b|SEOPFX-${sub}|g" "$skill_md"
  done

  # Resolve placeholders
  sed -i \
    -e "s|SEOPFX-|${prefix}-seo-|g" \
    -e "s|/SEOPFX|/${prefix}-seo|g" \
    "$skill_md"
}

# ── Helper: dotclaude-layout skill install (simple prefix) ───────────────────
install_skill_simple() {
  local src_dir="$1"
  local original_name="$2"
  local prefix="$3"
  local new_name="${prefix}-${original_name}"
  local dest="$SKILLS_DIR/$new_name"

  mkdir -p "$dest"
  cp -r "$src_dir/"* "$dest/" 2>/dev/null || true

  local skill_md="$dest/SKILL.md"
  [ -f "$skill_md" ] || return

  # Fix frontmatter name
  sed -i "s|^name: ${original_name}$|name: ${new_name}|" "$skill_md"
}

# ── Root layout install ───────────────────────────────────────────────────────
if [ "$LAYOUT" = "root" ]; then
  if [ -d "$REPO_PATH/skills" ]; then
    for skill_dir in "$REPO_PATH/skills"/*/; do
      [ -d "$skill_dir" ] || continue
      original_name=$(basename "$skill_dir")
      install_skill_seo "$skill_dir" "$original_name" "$PREFIX"
      echo "  Installed skill: ${PREFIX}-${original_name}"
    done
  fi

  # Check for a top-level orchestrator dir that is NOT in skills/ (e.g. geo/SKILL.md)
  SKILL_DIR="$SKILLS_DIR/${PREFIX}-seo"
  mkdir -p "$SKILL_DIR"
  for _d in "$REPO_PATH"/*/; do
    [ -d "$_d" ] || continue
    _dname=$(basename "$_d")
    case "$_dname" in
      .git|skills|agents|scripts|schema|docs|examples|assets|venv|.venv|references|templates|tests|white-label|pdf|hooks) continue ;;
    esac
    if [ -f "$_d/SKILL.md" ]; then
      cp "$_d/SKILL.md" "$SKILL_DIR/SKILL.md"
      sed -i \
        -e "s|^name: ${_dname}$|name: ${PREFIX}-seo|" \
        -e "s|/\b${_dname} |/${PREFIX}-seo |g" \
        -e "s|\b${_dname}-|\b${PREFIX}-${_dname}-|g" \
        "$SKILL_DIR/SKILL.md"
      echo "  Installed orchestrator: ${_dname}/SKILL.md → ${PREFIX}-seo"
      break
    fi
  done

  # Copy extra assets into main skill dir
  for folder in schema pdf scripts hooks; do
    if [ -d "$REPO_PATH/$folder" ]; then
      mkdir -p "$SKILL_DIR/$folder"
      cp -r "$REPO_PATH/$folder/"* "$SKILL_DIR/$folder/"
    fi
  done
  cp "$REPO_PATH/requirements.txt" "$SKILL_DIR/requirements.txt" 2>/dev/null || true

  if [ -d "$REPO_PATH/agents" ]; then
    for agent_file in "$REPO_PATH/agents"/*.md; do
      [ -f "$agent_file" ] || continue
      original_agent=$(basename "$agent_file")
      dest_agent="$AGENTS_DIR/${PREFIX}-${original_agent}"
      cp "$agent_file" "$dest_agent"
      sed -i "s|\bseo-|\b${PREFIX}-seo-|g" "$dest_agent" 2>/dev/null || true
      echo "  Installed agent: ${PREFIX}-${original_agent}"
    done
  fi

  # Python deps
  VENV="$SKILL_DIR/.venv"
  PY=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || echo "")
  if [ -n "$PY" ] && [ -f "$SKILL_DIR/requirements.txt" ]; then
    echo "Installing Python deps..."
    if "$PY" -m venv "$VENV" 2>/dev/null; then
      PIP="$VENV/Scripts/pip"
      [ -f "$PIP" ] || PIP="$VENV/bin/pip"
      "$PIP" install --quiet -r "$SKILL_DIR/requirements.txt" 2>/dev/null && \
        echo "  Deps installed in venv" || \
        echo "  Dep install failed — run: $PIP install -r $SKILL_DIR/requirements.txt"
    fi
  fi

  echo ""
  echo "Commands: /${PREFIX}-seo audit <url>, /${PREFIX}-seo-local <url>, etc."

# ── Geodir layout install (single named skill dir at root) ───────────────────
elif [ "$LAYOUT" = "geodir" ]; then
  SKILL_DIR="$SKILLS_DIR/${PREFIX}-seo"
  mkdir -p "$SKILL_DIR"

  # Copy the skill dir contents (e.g. geo/) into the new prefixed skill dir
  cp -r "$GEO_SKILL_DIR"/* "$SKILL_DIR/" 2>/dev/null || true

  # Rename the skill in frontmatter
  skill_md="$SKILL_DIR/SKILL.md"
  if [ -f "$skill_md" ]; then
    sed -i "s|^name: ${GEO_SKILL_NAME}$|name: ${PREFIX}-seo|" "$skill_md"
    echo "  Renamed skill: ${GEO_SKILL_NAME} → ${PREFIX}-seo"
  fi

  # Copy extra assets into skill dir
  for folder in schema scripts; do
    if [ -d "$REPO_PATH/$folder" ]; then
      mkdir -p "$SKILL_DIR/$folder"
      cp -r "$REPO_PATH/$folder/"* "$SKILL_DIR/$folder/" 2>/dev/null || true
    fi
  done
  cp "$REPO_PATH/requirements.txt" "$SKILL_DIR/requirements.txt" 2>/dev/null || true
  echo "  Installed skill dir: ${PREFIX}-seo"

  # Copy agents with prefix
  if [ -d "$REPO_PATH/agents" ]; then
    for agent_file in "$REPO_PATH/agents"/*.md; do
      [ -f "$agent_file" ] || continue
      original_agent=$(basename "$agent_file")
      dest_agent="$AGENTS_DIR/${PREFIX}-${original_agent}"
      cp "$agent_file" "$dest_agent"
      echo "  Installed agent: ${PREFIX}-${original_agent}"
    done
  fi

  # Python deps
  VENV="$SKILL_DIR/.venv"
  PY=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || echo "")
  if [ -n "$PY" ] && [ -f "$SKILL_DIR/requirements.txt" ]; then
    echo "Installing Python deps..."
    if "$PY" -m venv "$VENV" 2>/dev/null; then
      PIP="$VENV/Scripts/pip"
      [ -f "$PIP" ] || PIP="$VENV/bin/pip"
      "$PIP" install --quiet -r "$SKILL_DIR/requirements.txt" 2>/dev/null && \
        echo "  Deps installed in venv" || \
        echo "  Dep install failed — run: $PIP install -r $SKILL_DIR/requirements.txt"
    fi
  fi

  echo ""
  echo "Command: /${PREFIX}-seo  (GEO / AI search optimization)"

# ── Dotclaude layout install ──────────────────────────────────────────────────
else
  CLAUDE_DIR="$REPO_PATH/.claude"

  if [ -d "$CLAUDE_DIR/skills" ]; then
    for skill_dir in "$CLAUDE_DIR/skills"/*/; do
      [ -d "$skill_dir" ] || continue
      original_name=$(basename "$skill_dir")
      install_skill_simple "$skill_dir" "$original_name" "$PREFIX"
      echo "  Installed skill: ${PREFIX}-${original_name}"
    done
  fi

  if [ -d "$CLAUDE_DIR/agents" ]; then
    for agent_file in "$CLAUDE_DIR/agents"/*.md; do
      [ -f "$agent_file" ] || continue
      original_agent=$(basename "$agent_file" .md)
      dest_agent="$AGENTS_DIR/${PREFIX}-${original_agent}.md"
      cp "$agent_file" "$dest_agent"
      echo "  Installed agent: ${PREFIX}-${original_agent}"
    done
  fi

  if [ -d "$CLAUDE_DIR/commands" ]; then
    for cmd_file in "$CLAUDE_DIR/commands"/*.md; do
      [ -f "$cmd_file" ] || continue
      original_cmd=$(basename "$cmd_file" .md)
      dest_cmd="$COMMANDS_DIR/${PREFIX}-${original_cmd}.md"
      cp "$cmd_file" "$dest_cmd"
      echo "  Installed command: /${PREFIX}-${original_cmd}"
    done
  fi

  echo ""
  echo "Skills:   /${PREFIX}-seo-audit, /${PREFIX}-programmatic-seo, /${PREFIX}-copywriting ..."
  echo "Commands: /${PREFIX}-article, /${PREFIX}-optimize, /${PREFIX}-cluster ..."
fi

# ── Register in active list ───────────────────────────────────────────────────
echo "${TARGET}:${LAYOUT}:${PREFIX}" >> "$ACTIVE_FILE"
echo ""
echo "Active: $TARGET  (prefix: $PREFIX)"
echo "Restart Claude Code to pick up the new skills and commands."
