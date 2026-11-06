import csv
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CSV_FILE = BASE / "dades" / "incidencies.csv"
XML_FILE = BASE / "dades" / "incidencies.xml"

def sanitize(tag: str) -> str:
    # Netegem caràcters especials per a etiquetes XML vàlides
    return tag.strip()

def csv_a_xml(origen: Path, desti: Path) -> int:
    arrel = ET.Element("incidencies", {"origen": origen.name})
    with origen.open(encoding="utf-8-sig", newline="") as f:
        lector = csv.DictReader(f)
        total = 0
        for fila in lector:
            inc_id = fila.get("ID") or f"INC-{total+1:05d}"
            inc = ET.SubElement(arrel, "incidencia", {"id": inc_id})
            
            # Data de registre
            ET.SubElement(inc, "data_registre").text = fila.get("Timestamp", "")
            
            # Informador
            info = ET.SubElement(inc, "informador")
            ET.SubElement(info, "nom").text = fila.get("Nom i cognoms", "")
            ET.SubElement(info, "email").text = fila.get("Correu electrònic", "")
            ET.SubElement(info, "departament").text = fila.get("Departament", "")
            
            # Equip
            codi = fila.get("Codi d'inventari de l'equip", "")
            eq = ET.SubElement(inc, "equip", {"codi": codi})
            ET.SubElement(eq, "tipus").text = fila.get("Tipus d'equip", "")
            ET.SubElement(eq, "categoria").text = fila.get("Categoria", "")
            ET.SubElement(eq, "ubicacio").text = fila.get("Ubicació de l'equip", "")
            
            # Detalls incidència
            ET.SubElement(inc, "descripcio").text = fila.get("Descripció del problema", "")
            ET.SubElement(inc, "prioritat").text = fila.get("Prioritat", "")
            ET.SubElement(inc, "data_inici").text = fila.get("Quan va començar el problema?", "")
            ET.SubElement(inc, "operatiu").text = fila.get("L'equip es pot continuar fent servir?", "")
            ET.SubElement(inc, "grau_afectacio").text = fila.get("Grau d'afectació a la classe / feina", "")
            
            total += 1

    arrel.set("total", str(total))
    arbre = ET.ElementTree(arrel)
    ET.indent(arbre, space="  ")
    arbre.write(desti, encoding="utf-8", xml_declaration=True)
    return total

if __name__ == "__main__":
    if not CSV_FILE.exists():
        sys.exit(f"No trobo {CSV_FILE}")
    n = csv_a_xml(CSV_FILE, XML_FILE)
    print(f"✔ {n} incidències convertides amb èxit a {XML_FILE}")