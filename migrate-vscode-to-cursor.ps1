# VS Code to Cursor Migration Script
# This script migrates your VS Code extensions and settings to Cursor

Write-Host "=== VS Code to Cursor Migration ===" -ForegroundColor Cyan
Write-Host ""

# Define paths
$vscodeExtensionsPath = "$env:USERPROFILE\.vscode\extensions"
$vscodeSettingsPath = "$env:APPDATA\Code\User\settings.json"
$vscodeKeybindingsPath = "$env:APPDATA\Code\User\keybindings.json"
$vscodeSnippetsPath = "$env:APPDATA\Code\User\snippets"

$cursorExtensionsPath = "$env:USERPROFILE\.cursor\extensions"
$cursorUserPath = "$env:APPDATA\Cursor\User"
$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"
$cursorKeybindingsPath = "$env:APPDATA\Cursor\User\keybindings.json"
$cursorSnippetsPath = "$env:APPDATA\Cursor\User\snippets"

# Create Cursor directories if they don't exist
Write-Host "Creating Cursor directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $cursorUserPath | Out-Null
New-Item -ItemType Directory -Force -Path $cursorExtensionsPath | Out-Null
New-Item -ItemType Directory -Force -Path $cursorSnippetsPath | Out-Null

# 1. Migrate Extensions
Write-Host ""
Write-Host "1. Migrating Extensions..." -ForegroundColor Yellow
if (Test-Path $vscodeExtensionsPath) {
    $extensions = Get-ChildItem -Path $vscodeExtensionsPath -Directory
    Write-Host "   Found $($extensions.Count) extensions in VS Code" -ForegroundColor Gray
    
    $copiedCount = 0
    foreach ($ext in $extensions) {
        $destPath = Join-Path $cursorExtensionsPath $ext.Name
        if (-not (Test-Path $destPath)) {
            Write-Host "   Copying: $($ext.Name)" -ForegroundColor Gray
            Copy-Item -Path $ext.FullName -Destination $destPath -Recurse -Force
            $copiedCount++
        } else {
            Write-Host "   Skipping (already exists): $($ext.Name)" -ForegroundColor DarkGray
        }
    }
    Write-Host "   [OK] Copied $copiedCount extensions to Cursor" -ForegroundColor Green
} else {
    Write-Host "   [X] VS Code extensions folder not found at: $vscodeExtensionsPath" -ForegroundColor Red
}

# 2. Migrate Settings
Write-Host ""
Write-Host "2. Migrating Settings..." -ForegroundColor Yellow
if (Test-Path $vscodeSettingsPath) {
    # Function to remove JSON comments (VS Code allows comments in JSON)
    function Remove-JsonComments {
        param([string]$jsonContent)
        # Remove single-line comments (// ...)
        $jsonContent = $jsonContent -replace '(?m)//.*$', ''
        # Remove multi-line comments (/* ... */)
        $jsonContent = $jsonContent -replace '(?s)/\*.*?\*/', ''
        return $jsonContent
    }
    
    $settingsContent = Get-Content $vscodeSettingsPath -Raw
    
    if (Test-Path $cursorSettingsPath) {
        Write-Host "   Cursor settings.json already exists. Merging..." -ForegroundColor Gray
        try {
            $cursorSettingsRaw = Get-Content $cursorSettingsPath -Raw
            $cursorSettings = Remove-JsonComments $cursorSettingsRaw | ConvertFrom-Json
            $vscodeSettings = Remove-JsonComments $settingsContent | ConvertFrom-Json
            
            # Merge settings (VS Code settings take precedence)
            $mergedSettings = $cursorSettings
            $vscodeSettings.PSObject.Properties | ForEach-Object {
                if ($null -ne $_.Name) {
                    $mergedSettings | Add-Member -MemberType NoteProperty -Name $_.Name -Value $_.Value -Force
                }
            }
            
            $mergedSettings | ConvertTo-Json -Depth 10 | Set-Content $cursorSettingsPath
            Write-Host "   [OK] Settings merged successfully" -ForegroundColor Green
        } catch {
            Write-Host "   [WARNING] Could not merge settings (JSON parsing error). Copying VS Code settings instead..." -ForegroundColor Yellow
            Copy-Item -Path $vscodeSettingsPath -Destination $cursorSettingsPath -Force
            Write-Host "   [OK] Settings copied to Cursor (backup your original Cursor settings if needed)" -ForegroundColor Green
        }
    } else {
        Copy-Item -Path $vscodeSettingsPath -Destination $cursorSettingsPath -Force
        Write-Host "   [OK] Settings copied to Cursor" -ForegroundColor Green
    }
} else {
    Write-Host "   [X] VS Code settings.json not found at: $vscodeSettingsPath" -ForegroundColor Red
}

# 3. Migrate Keybindings
Write-Host ""
Write-Host "3. Migrating Keybindings..." -ForegroundColor Yellow
if (Test-Path $vscodeKeybindingsPath) {
    Copy-Item -Path $vscodeKeybindingsPath -Destination $cursorKeybindingsPath -Force
    Write-Host "   [OK] Keybindings copied to Cursor" -ForegroundColor Green
} else {
    Write-Host "   [INFO] No keybindings.json found in VS Code (this is normal if you haven't customized keybindings)" -ForegroundColor Gray
}

# 4. Migrate Snippets
Write-Host ""
Write-Host "4. Migrating Snippets..." -ForegroundColor Yellow
if (Test-Path $vscodeSnippetsPath) {
    $snippetFiles = Get-ChildItem -Path $vscodeSnippetsPath -File
    if ($snippetFiles.Count -gt 0) {
        foreach ($snippet in $snippetFiles) {
            $destSnippet = Join-Path $cursorSnippetsPath $snippet.Name
            Copy-Item -Path $snippet.FullName -Destination $destSnippet -Force
            Write-Host "   Copied: $($snippet.Name)" -ForegroundColor Gray
        }
        Write-Host "   [OK] Copied $($snippetFiles.Count) snippet files to Cursor" -ForegroundColor Green
    } else {
        Write-Host "   [INFO] No custom snippets found" -ForegroundColor Gray
    }
} else {
    Write-Host "   [INFO] No snippets folder found in VS Code" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "=== Migration Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart Cursor to load the migrated extensions and settings" -ForegroundColor White
Write-Host "2. Some extensions may need to be reinstalled from the marketplace" -ForegroundColor White
Write-Host "3. Check your settings.json for any VS Code-specific paths that need updating" -ForegroundColor White
Write-Host ""
Write-Host "Cursor Settings location: $cursorSettingsPath" -ForegroundColor Gray
Write-Host "Cursor Extensions location: $cursorExtensionsPath" -ForegroundColor Gray

