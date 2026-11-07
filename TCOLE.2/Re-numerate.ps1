$file = "H:\OneDrive\Documents\Physical Security\Police\LEA\TCOLE-MASTER\TCOLE.2\master-bank.js"

$content = Get-Content $file -Raw

$counter = 1

$content = [regex]::Replace(
    $content,
    'id:\s*"TCOLE_q\d+"',
    {
        param($match)

        $newId = 'id: "TCOLE_q' + $counter + '"'
        $script:counter++
        return $newId
    }
)

Set-Content -Path $file -Value $content -Encoding UTF8

Write-Host "Renumbered $($counter - 1) questions."