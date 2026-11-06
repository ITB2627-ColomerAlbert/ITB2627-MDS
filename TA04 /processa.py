#!/usr/bin/env python3
"""
TA04 - Passos 3 i 4: Processar les dades XML (filtratge de dades errònies,
càlcul d'estadístiques i presentació visual) i emmagatzemar la informació neta en JSON.
"""
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
XML_FILE = BASE / "dades" / "incidencies.xml"
JSON_FILE = BASE / "dades" / "incidencies.json"

if os.name == "nt":
    os.system("")  # Colors ANSI a Windows

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# Colors ANSI
R, B, DIM = "\033[0m", "\033[1m", "\033[2m"
VERM, VERD, GROC, BLAU, MAG, CIAN = (f"\033[{c}m" for c in (91, 92, 93, 94, 95, 96))
COLOR_PRIO = {"Crítica": VERM, "CrÃtica": VERM, "Alta": GROC, "Mitjana": BLAU, "Baixa": VERD}
EMAIL_RE = re.compile(r"^[\w.+-]+@[\w-]+\.[\w.]+$")

def titol(text):
    print(f"\n{B}{CIAN}╔{'═' * 64}╗\n║ {text:<62} ║\n╚{'═' * 64}╝{R}")

def barra(n, maxim, ample=28, color=BLAU):
    plens = round(n / maxim * ample) if maxim else 0
    return f"{color}{'█' * plens}{DIM}{'░' * (ample - plens)}{R}"

def taula(comptador, total, color=BLAU, colors=None):
    maxim = max(comptador.values()) if comptador else 0
    for clau, n in comptador.most_common():
        c = (colors or {}).get(clau, color)
        etiqueta = str(clau)[:22]
        print(f"  {etiqueta:<22} {barra(n, maxim, color=c)} {B}{n:>5}{R} {DIM}({n / total:5.1%}){R}")

def text(el, cami):
    t = el.findtext(cami)
    return t.strip() if t else ""

def llegeix_xml(path):
    arrel = ET.parse(path).getroot()
    for inc in arrel.iter("incidencia"):
        yield {
            "id": inc.get("id"),
            "data_registre": text(inc, "data_registre"),
            "informador": text(inc, "informador/nom"),
            "email": text(inc, "informador/email"),
            "departament": text(inc, "informador/departament"),
            "codi_equip": inc.find("equip").get("codi") if inc.find("equip") is not None else "",
            "tipus_equip": text(inc, "equip/tipus"),
            "categoria": text(inc, "equip/categoria"),
            "ubicacio": text(inc, "equip/ubicacio"),
            "descripcio": text(inc, "descripcio"),
            "prioritat": text(inc, "prioritat"),
            "data_inici": text(inc, "data_inici"),
            "operatiu": text(inc, "operatiu"),
            "grau_afectacio": text(inc, "grau_afectacio"),
        }

def valida(inc, vistos):
    if inc["id"] in vistos:
        return "ID duplicat"
    
    # Comprovació de data errònia / futura (ex: 2064)
    data_str = inc["data_inici"] or inc["data_registre"]
    if "2064" in data_str:
        return "Data futura errònia (2064)"
    
    if not inc["descripcio"]:
        return "Sense descripció del problema"
    
    if inc["email"] and not EMAIL_RE.match(inc["email"]):
        return "Format d'email invàlid"
        
    return None

def neteja(incidencies):
    bones, descarts, vistos = [], Counter(), set()
    for inc in incidencies:
        motiu = valida(inc, vistos)
        if motiu:
            descarts[motiu] += 1
            continue
        vistos.add(inc["id"])
        bones.append(inc)
    return bones, descarts

def mostra_estadistiques(bones, descarts, brut):
    total = len(bones)
    titol("📊  INFORME D'INCIDÈNCIES TIC I AUDIOVISUALS · ITB")
    print(f"  Total registres analitzats : {B}{brut}{R}")
    print(f"  Registres vàlids           : {VERD}{B}{total}{R}")
    print(f"  Dades descartades (filtrades) : {VERM}{B}{brut - total}{R}")
    
    for motiu, n in descarts.most_common():
        print(f"    {VERM}✘ {motiu:<30} : {n}{R}")

    titol("🚦  DISTRIBUCIÓ PER PRIORITAT")
    taula(Counter(i["prioritat"] for i in bones), total, MAG, COLOR_PRIO)

    titol("🖥️   DISTRIBUCIÓ PER TIPUS D'EQUIP")
    taula(Counter(i["tipus_equip"] for i in bones), total, CIAN)

    titol("🗂️   DISTRIBUCIÓ PER CATEGORIA")
    taula(Counter(i["categoria"] for i in bones), total, BLAU)

    titol("🏢  DISTRIBUCIÓ PER DEPARTAMENT")
    taula(Counter(i["departament"] for i in bones), total, VERD)

    titol("📍  TOP 5 UBICACIONS AMB MÉS INCIDÈNCIES")
    for pos, (u, n) in enumerate(Counter(i["ubicacio"] for i in bones).most_common(5), 1):
        print(f"  {B}{pos}.{R} {u:<25} {CIAN}{B}{n}{R} incidències")

    titol("⚠️   TOP 5 AVARIES / DESCRIPCIONS MÉS FREQÜENTS")
    for pos, (d, n) in enumerate(Counter(i["descripcio"] for i in bones).most_common(5), 1):
        desc = (d[:40] + '...') if len(d) > 40 else d
        print(f"  {B}{pos}.{R} {desc:<43} {GROC}{B}{n}{R}")

    titol("⚙️   ESTAT OPERATIU DE L'EQUIP")
    taula(Counter(i["operatiu"] for i in bones), total, GROC)

def desa_json(bones):
    if JSON_FILE.exists():
        print(f"\n{GROC}El fitxer {JSON_FILE.name} ja existeix.{R}")
        print("  [1] Sobreescriure'l (esborra el contingut anterior)")
        print("  [2] Afegir noves incidències (evitant IDs duplicats)")
        print("  [3] Cancel·lar")
        op = input("Tria una opció (1/2/3): ").strip()
        if op == "1":
            dades = bones
        elif op == "2":
            with JSON_FILE.open(encoding="utf-8") as f:
                dades = json.load(f)
            ids = {i["id"] for i in dades}
            noves = [i for i in bones if i["id"] not in ids]
            dades.extend(noves)
            print(f"  {VERD}+{len(noves)} incidències noves afegides.{R}")
        else:
            print("  Operació cancel·lada.")
            return
    else:
        dades = bones

    with JSON_FILE.open("w", encoding="utf-8") as f:
        json.dump(dades, f, ensure_ascii=False, indent=2)
    print(f"\n{VERD}✔ {len(dades)} incidències desades a {JSON_FILE}{R}")

def main():
    if not XML_FILE.exists():
        sys.exit(f"No trobo {XML_FILE}")
    totes = list(llegeix_xml(XML_FILE))
    bones, descarts = neteja(totes)
    mostra_estadistiques(bones, descarts, len(totes))
    desa_json(bones)

if __name__ == "__main__":
    main()