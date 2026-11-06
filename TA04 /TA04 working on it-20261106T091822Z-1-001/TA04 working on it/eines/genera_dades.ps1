# Simula les respostes del Google Form i exporta incidencies.csv (UTF-8)
param([int]$N = 1200, [string]$Out = "$PSScriptRoot\..\dades\incidencies.csv")
$r = New-Object System.Random 42
function P($a) { $a[$r.Next($a.Count)] }
$noms = 'Marc Puig','Laia Soler','Pau Vidal','Júlia Ferrer','Arnau Roca','Martina Serra','Pol Costa','Ona Font','Jan Mas','Carla Pons','Nil Riera','Aina Camps','Biel Sala','Emma Vila','Hugo López','Lucía García','Mateo Martín','Sofía Pérez','Àlex Torres','Noa Romero'
$deps = 'Administració','Docència','Secretaria','Direcció','Biblioteca','Sistemes','Consergeria','Laboratori'
$ubic = 'Aula 101','Aula 102','Aula 204','Aula 305','Lab Xarxes','Lab Hardware','Sala Actes','Biblioteca','Despatx Direcció','Secretaria','Sala Professors','CPD'
$equips = @{
 'Ordinador'  = @('No arrenca','Pantalla blava','Molt lent','Virus detectat','No connecta a la xarxa','Teclat no funciona')
 'Portàtil'   = @('Bateria no carrega','Pantalla trencada','No detecta WiFi','Sobreescalfament','Touchpad no respon')
 'Impressora' = @('Paper encallat','Sense tòner','No imprimeix','Imprimeix en blanc','Error de connexió')
 'Projector'  = @('No mostra imatge','Làmpada fosa','Colors distorsionats','No detecta HDMI','Comandament perdut')
 'Xarxa'      = @('Sense connexió','Punt d''accés caigut','Switch no respon','Connexió intermitent','Cable trencat')
 'Pantalla'   = @('No encén','Píxels morts','Parpelleig','Cable VGA malmès')
 'Altaveus'   = @('No sona','Soroll de fons','Volum molt baix')
 'Servidor'   = @('Servei caigut','Disc ple','Backup fallit','Alta càrrega de CPU')
 'Telèfon IP' = @('Sense to','No registra','Pantalla apagada')
 'Pissarra digital' = @('Calibratge incorrecte','No respon al tacte','Sense imatge')
}
$cat = @{ 'Ordinador'='Hardware';'Portàtil'='Hardware';'Impressora'='Perifèrics';'Projector'='Audiovisual';'Xarxa'='Xarxa';'Pantalla'='Perifèrics';'Altaveus'='Audiovisual';'Servidor'='Infraestructura';'Telèfon IP'='Comunicacions';'Pissarra digital'='Audiovisual' }
$prio = 'Baixa','Mitjana','Mitjana','Alta','Crítica'
$estat = 'Oberta','En curs','Resolta','Resolta','Resolta','Tancada'
$tec = 'Javier A.','Meritxell D.','Equip Sistemes','Proveïdor extern'
$keys = @($equips.Keys)
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('id,data_registre,informador,email,departament,ubicacio,tipus_equip,codi_equip,categoria,descripcio,prioritat,estat,tecnic_assignat,data_resolucio,temps_resolucio_h,valoracio')
$start = Get-Date '2026-09-01'
for ($i = 1; $i -le $N; $i++) {
  $nom = P $noms; $eq = P $keys
  $d = $start.AddMinutes($r.Next(0, 60*24*65))
  $e = P $estat; $res = ''; $h = ''; $val = ''
  if ($e -in 'Resolta','Tancada') { $hh = [math]::Round($r.NextDouble()*72 + 0.25, 2); $res = $d.AddHours($hh).ToString('yyyy-MM-dd HH:mm'); $h = $hh.ToString([Globalization.CultureInfo]::InvariantCulture); $val = $r.Next(1,6) }
  $mail = (($nom -replace ' ','.').ToLower() -replace 'à','a' -replace '[èé]','e' -replace '[íï]','i' -replace '[òó]','o' -replace 'ú','u') + '@itb.cat'
  $desc = P $equips[$eq]
  $data = $d.ToString('yyyy-MM-dd HH:mm')
  # Dades errònies intencionades (com passa amb formularis reals)
  $x = $r.Next(100)
  if ($x -eq 0) { $data = '2064-' + $d.ToString('MM-dd HH:mm') }
  elseif ($x -eq 1) { $desc = '' }
  elseif ($x -eq 2) { $mail = 'sense-correu' }
  $code = '{0}-{1:D3}' -f ($eq.Substring(0,3).ToUpper()), $r.Next(1,120)
  $f = @(('INC-{0:D5}' -f $i),$data,$nom,$mail,(P $deps),(P $ubic),$eq,$code,$cat[$eq],$desc,(P $prio),$e,(P $tec),$res,$h,$val)
  [void]$sb.AppendLine((($f | % { '"' + ([string]$_ -replace '"','""') + '"' }) -join ','))
}
# Algun duplicat exacte, per provar la neteja
$lines = $sb.ToString().TrimEnd() -split "`r?`n"
$extra = $lines[5..9] -join "`r`n"
New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null
[IO.File]::WriteAllText($Out, $sb.ToString() + $extra + "`r`n", (New-Object Text.UTF8Encoding $false))
"Generades $N incidències -> $Out"
