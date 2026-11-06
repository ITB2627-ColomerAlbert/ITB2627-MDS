# ==========================================
# TEST: Parser preliminar CSV a XML (Proves)
# Grup G6 - ASIX ITB
# ==========================================

import csv

def test_lectura():
    with open('dades/incidencies.csv', mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        headers = next(reader)
        print("Capçaleres trobades:", headers)
        print("Provant primeres 5 files...")
        for i in range(5):
            print(f"Fila {i+1}:", next(reader))

if __name__ == '__main__':
    test_lectura()