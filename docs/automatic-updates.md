# Automatická aktualizace hry

Produkční build vytváří version.json a identifikátor sestavení. Otevřená hra kontroluje server při spuštění, návratu na viditelnou kartu, obnovení internetu a každé dvě minuty. Vývojový server se sám neaktualizuje.

Nová verze se načte až po alespoň dvou sekundách bezpečného stavu: bez minihry, dialogu, odletu, přechodu nebo odměny, s potvrzeným místním uložením. Přihlášený účet navíc vyžaduje potvrzené cloudové uložení. Offline a chyby ukládání aktualizaci odkládají. Přidání gameVersion do adresy obejde starou kopii HTML; pojistka v sessionStorage zabrání opakovanému načítání stejného cíle při zastaralé odpovědi serveru.

Build doplňuje verzovací query parametr do odkazů na rasterové i SVG obrázky ve výsledném JavaScriptu a CSS, včetně skládání názvů scén. Soubory z public zůstávají pod původními názvy. JavaScript standardně verzuje Vite.

Funkce se týká hry, nikoli automatického obnovení analytického dashboardu. Automatické nasazení zůstává existující GitHub Actions workflow. Pro první zavedení této funkce je nutné jednou otevřít aktuální verzi hry; starší již otevřená verze kontrolu ještě nemá.
