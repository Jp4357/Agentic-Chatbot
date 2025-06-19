#!/bin/bash

# 🎯 React Vite Project Context Combiner Script
# Combines source files from the src folder into a single context file

# 📄 Output file
OUTPUT_FILE="combined_react_context.txt"

# 🗑️ Clear the output file
> "$OUTPUT_FILE"

echo "🚀 Starting to combine React Vite project files from src folder..."
echo ""

# 📊 Counter for total files processed
total_files=0

# 🔧 Function to process files in a directory
process_directory() {
    local dir="$1"
    local description="$2"
    local extensions="$3"

    if [ ! -d "$dir" ]; then
        echo "⚠️  Warning: Directory $dir does not exist. Skipping."
        echo ""
        return
    fi

    echo "📁 Processing $description: $dir"

    # 🔍 Find files with specified extensions, excluding common ignore directories
    local files_found=0

    # Create find command with multiple extensions
    find_cmd="find \"$dir\" -type f \( "

    # Add extensions to find command
    IFS=',' read -ra EXT_ARRAY <<< "$extensions"
    first=true
    for ext in "${EXT_ARRAY[@]}"; do
        ext=$(echo "$ext" | xargs) # trim whitespace
        if [ "$first" = true ]; then
            find_cmd+=" -name \"*.$ext\""
            first=false
        else
            find_cmd+=" -o -name \"*.$ext\""
        fi
    done

    # Exclude common directories and the assets folder within the target directory
    find_cmd+=" \) -not -path \"*/node_modules/*\" -not -path \"*/dist/*\" -not -path \"*/build/*\" -not -path \"*/.git/*\" -not -path \"*/.vscode/*\" -not -path \"*/coverage/*\" -not -path \"$dir/assets/*\""

    # Execute find command and process results
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            echo "-- $file --" >> "$OUTPUT_FILE"

            # 📖 Try to read file content
            if cat "$file" >> "$OUTPUT_FILE" 2>/dev/null; then
                echo "" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                ((files_found++))
                ((total_files++))
            else
                echo "⚠️  Skipped unreadable file: $file"
            fi
        fi
    done < <(eval "$find_cmd -print0" 2>/dev/null)

    echo "   Found $files_found files"
    echo "✅ Completed $description"
    echo ""
}

# 🏗️ Process main source directory (src)
# Modified to include more file types commonly found in a React src directory
process_directory "./src" "Source Code" "ts,tsx,js,jsx,css,html,json,svg"

# 📊 Calculate file size
if [ -f "$OUTPUT_FILE" ]; then
    file_size=$(du -h "$OUTPUT_FILE" | cut -f1)

    echo "🎉 SUCCESS!"
    echo "📄 All React Vite files from src combined into: $(pwd)/$OUTPUT_FILE"
    echo "📊 File size: $file_size"
    echo "📈 Total files processed: $total_files"
else
    echo "❌ Error: Output file was not created"
    exit 1
fi