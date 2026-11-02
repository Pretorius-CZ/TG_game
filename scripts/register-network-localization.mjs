// Idempotent registration of the first network expansion in the existing catalogs.
import {readFileSync,writeFileSync} from 'node:fs';
import {networkDraftLevels} from '../src/experimental/networkChapter.js';
const codes=['cs','de','fr','es','pt-BR'];
const editions={
 de:[
 ['Den Wartungsdienst übernehmen','Die Expedition ist zu Hause. Der Operator bittet uns, das Netz zu erweitern, nicht den abgeschlossenen Notruf erneut zu öffnen.','Unsere nächste Fracht besteht aus Ersatzmodulen für die Signalfeuer.'],
 ['Die Signalverbindung einsetzen','Prüfe die neue Verbindung, bevor du die äußeren Stromkreise anschließt.','Das Testsignal kehrt unverändert zurück. Der Notfunk bleibt ungestört.'],
 ['Den ersten Routenknoten versorgen','Bilde Kombinationen neben Knoten 1. Jede vollständige Kombination liefert einen Impuls.','Der erste Verteilerknoten ist für eine zweite Verbindung bereit.'],
 ['Den Rückkanal offen halten','Versorge die nummerierten Knoten der Reihe nach. Nur der leuchtende Knoten nimmt Energie auf.','Beide Enden bestätigen die aktive Route. Gespeicherte Nachrichten bleiben im Archiv.'],
 ['Die Übergabe prüfen · SCHWER','Prüfe die gesamte Route, bevor der nächste Operator den Dienst übernimmt.','Die Rettungsstation hält die alte Route offen, während wir die Erweiterung bauen.'],
 ['Den äußeren Liegeplatz vermessen','Wähle einen stabilen Montagepunkt für eine neue, unbesetzte Serviceplattform.','Die neue Plattform entlastet den Rettungsdock.'],
 ['Den Plattformrahmen sichern','Befestige den vorgefertigten Rahmen an der vermessenen Position.','Unser Versorgungsschiff liefert endlich Bauteile, statt nach seinem Ziel zu suchen.'],
 ['Die Servicekreise trennen','Schalte die Stromversorgung der Reihe nach ein. Das Rückkehrsignal bleibt unabhängig.','Ein defekter Werkstattkreis wird die Landelichter nicht mehr ausschalten.'],
 ['Die Wartungswerkstatt öffnen','Bereite Werkzeug und Ersatzteile für die Wartungsteams der Signalfeuer vor.','Eine einfache Werkstatt gibt dem Netz einen Ort, an dem es seine Geräte reparieren kann.'],
 ['Die Plattform in Betrieb nehmen · SCHWER','Prüfe die Route mit drei Knoten und die Vorräte, bevor du die Plattform öffnest.','Das erste Wartungsteam bestätigt seine Ankunftszeit. Dies ist eine neue Reise, keine weitere vermisste Expedition.'],
 ],
 fr:[
 ['Prendre la relève du réseau','L’expédition est rentrée. L’opérateur nous demande d’étendre le réseau, pas de rouvrir l’ancien appel de détresse.','Notre prochaine cargaison contient des modules de rechange pour les balises.'],
 ['Installer le coupleur de signal','Teste le nouveau coupleur avant de brancher les circuits extérieurs.','Le signal de test revient intact. Les communications d’urgence restent disponibles.'],
 ['Alimenter le premier nœud','Aligne des pièces près du nœud 1. Chaque combinaison complète fournit une impulsion.','Le premier nœud de distribution est prêt pour une seconde liaison.'],
 ['Garder le canal de retour ouvert','Alimente les nœuds numérotés dans l’ordre. Seul le nœud lumineux reçoit de l’énergie.','Les deux extrémités confirment la route active. Les anciens messages restent dans les archives.'],
 ['Vérifier la relève · DIFFICILE','Teste toute la route avant que le prochain opérateur ne prenne la relève.','La station de secours garde l’ancienne route ouverte pendant que nous construisons son extension.'],
 ['Inspecter le mouillage extérieur','Choisis un point de fixation stable pour une nouvelle plateforme de service inoccupée.','La nouvelle plateforme soutiendra le trafic sans encombrer le quai de secours.'],
 ['Fixer la structure de la plateforme','Fixe la structure préfabriquée à l’emplacement relevé.','Notre vaisseau de ravitaillement livre enfin du matériel au lieu de chercher sa destination.'],
 ['Séparer les circuits de service','Active l’alimentation dans l’ordre en gardant la balise de retour indépendante.','Une panne de l’atelier n’éteindra plus les feux d’atterrissage.'],
 ['Ouvrir l’atelier de maintenance','Prépare les outils et les pièces de rechange pour les équipes d’entretien des balises.','Le réseau dispose désormais d’un atelier pour réparer son matériel.'],
 ['Mettre la plateforme en service · DIFFICILE','Teste la route à trois nœuds et vérifie les provisions avant d’ouvrir la plateforme.','La première équipe de maintenance confirme son créneau d’arrivée. C’est un nouveau voyage, pas une autre expédition disparue.'],
 ],
 es:[
 ['Tomar el relevo de la red','La expedición está en casa. El operador nos pide ampliar la red, no reabrir la antigua llamada de socorro.','Nuestra próxima carga contiene módulos de repuesto para las balizas.'],
 ['Instalar el acoplador de señal','Prueba el nuevo acoplador antes de conectar los circuitos exteriores.','La señal de prueba regresa intacta. Las comunicaciones de emergencia siguen disponibles.'],
 ['Alimentar el primer nodo','Combina junto al nodo 1. Cada combinación completa aporta un impulso.','El primer nodo de distribución está listo para un segundo enlace.'],
 ['Mantener abierto el canal de retorno','Alimenta los nodos numerados en orden. Solo el nodo iluminado recibe energía.','Ambos extremos confirman la ruta activa. Los mensajes guardados permanecen en el archivo.'],
 ['Verificar el relevo · DIFÍCIL','Prueba toda la ruta antes de que el siguiente operador tome el relevo.','La estación de rescate mantiene abierta la ruta antigua mientras construimos la ampliación.'],
 ['Inspeccionar el fondeadero exterior','Elige un punto de montaje estable para una nueva plataforma de servicio desocupada.','La nueva plataforma ayudará al tráfico sin saturar el muelle de rescate.'],
 ['Fijar la estructura de la plataforma','Fija la estructura prefabricada en la posición inspeccionada.','Nuestra nave de suministros por fin entrega material en vez de buscar su destino.'],
 ['Separar los circuitos de servicio','Activa la alimentación en orden y mantén independiente la baliza de retorno.','Una avería del taller ya no apagará las luces de aterrizaje.'],
 ['Abrir el taller de mantenimiento','Prepara herramientas y repuestos para los equipos de mantenimiento de las balizas.','La red ya dispone de un taller donde reparar sus equipos.'],
 ['Poner la plataforma en servicio · DIFÍCIL','Prueba la ruta de tres nodos y comprueba los suministros antes de abrir la plataforma.','El primer equipo de mantenimiento confirma su llegada. Es un nuevo viaje, no otra expedición desaparecida.'],
 ],
 'pt-BR':[
 ['Assumir o turno da rede','A expedição está em casa. O operador pede que ampliemos a rede, sem reabrir o antigo pedido de socorro.','Nossa próxima carga contém módulos de reposição para os sinalizadores.'],
 ['Instalar o acoplador de sinal','Teste o novo acoplador antes de conectar os circuitos externos.','O sinal de teste volta intacto. As comunicações de emergência continuam disponíveis.'],
 ['Alimentar o primeiro nó','Combine peças ao lado do nó 1. Cada combinação completa fornece um pulso.','O primeiro nó de distribuição está pronto para uma segunda conexão.'],
 ['Manter o canal de retorno aberto','Alimente os nós numerados em ordem. Só o nó iluminado recebe energia.','As duas pontas confirmam a rota ativa. As mensagens antigas permanecem no arquivo.'],
 ['Verificar a passagem de turno · DIFÍCIL','Teste toda a rota antes de o próximo operador assumir o turno.','A estação de resgate mantém a rota antiga aberta enquanto construímos a ampliação.'],
 ['Inspecionar o ancoradouro externo','Escolha um ponto de montagem estável para uma nova plataforma de serviço desocupada.','A nova plataforma ajudará o tráfego sem sobrecarregar a doca de resgate.'],
 ['Fixar a estrutura da plataforma','Fixe a estrutura pré-fabricada na posição inspecionada.','Nossa nave de suprimentos finalmente entrega equipamentos em vez de procurar seu destino.'],
 ['Separar os circuitos de serviço','Ligue a energia em ordem e mantenha o sinalizador de retorno independente.','Uma falha no circuito da oficina não apagará mais as luzes de pouso.'],
 ['Abrir a oficina de manutenção','Prepare ferramentas e peças de reposição para as equipes de manutenção dos sinalizadores.','A rede agora tem uma oficina para consertar seus equipamentos.'],
 ['Colocar a plataforma em operação · DIFÍCIL','Teste a rota de três nós e confira os suprimentos antes de abrir a plataforma.','A primeira equipe de manutenção confirma sua chegada. É uma nova viagem, não outra expedição desaparecida.'],
 ],
};
const extra=[
 ['network','síť','Netz','réseau','red','rede'],
 ['The new network','Nová síť','Das neue Netz','Le nouveau réseau','La nueva red','A nova rede'],
 ['The network watch','Služba sítě','Der Netzdienst','La relève du réseau','El turno de la red','O turno da rede'],
 ['The service platform','Servisní plošina','Die Serviceplattform','La plateforme de service','La plataforma de servicio','A plataforma de serviço'],
 ['Network service log','Deník služby sítě','Netzdienst-Logbuch','Journal de maintenance du réseau','Diario de servicio de la red','Registro de manutenção da rede'],
 ['Continue the network work','Pokračovat v práci na síti','Die Netzarbeiten fortsetzen','Poursuivre les travaux du réseau','Continuar los trabajos de la red','Continuar os trabalhos da rede'],
 ['Collect the marked components. Power the numbered nodes in order. Blasts do not directly charge nodes.','Nasbírej označené díly. Napájej očíslované uzly v pořadí. Výbuchy uzly přímo nenabíjejí.','Sammle die markierten Bauteile. Versorge die nummerierten Knoten der Reihe nach. Explosionen laden die Knoten nicht direkt auf.','Collecte les composants indiqués. Alimente les nœuds numérotés dans l’ordre. Les explosions ne les chargent pas directement.','Recoge los componentes indicados. Alimenta los nodos numerados en orden. Las explosiones no los cargan directamente.','Colete os componentes indicados. Alimente os nós numerados em ordem. Explosões não os carregam diretamente.'],
 ['Power the glowing node first. Each separate adjacent match adds one pulse. The next node opens for the next wave, including cascades. Blasts do not directly charge nodes.','Nejdřív napájej zářící uzel. Každá samostatná sousední kombinace přidá impulz. Další uzel přijímá až v následující vlně, i při kaskádě. Výbuchy uzly přímo nenabíjejí.','Versorge zuerst den leuchtenden Knoten. Jede einzelne benachbarte Kombination liefert einen Impuls. Der nächste Knoten öffnet sich erst für die nächste Welle, auch bei Kaskaden. Explosionen laden Knoten nicht direkt auf.','Alimente d’abord le nœud lumineux. Chaque combinaison adjacente distincte ajoute une impulsion. Le nœud suivant s’active à la prochaine vague, y compris pendant une cascade. Les explosions ne chargent pas directement les nœuds.','Alimenta primero el nodo iluminado. Cada combinación adyacente independiente añade un impulso. El siguiente nodo se activa en la próxima oleada, incluidas las cascadas. Las explosiones no cargan nodos directamente.','Alimente primeiro o nó iluminado. Cada combinação adjacente independente adiciona um pulso. O próximo nó se abre na próxima onda, inclusive em cascatas. Explosões não carregam nós diretamente.'],
 ['The platform is ready for its first maintenance crew.','Plošina je připravená na první servisní posádku.','Die Plattform ist für ihr erstes Wartungsteam bereit.','La plateforme est prête pour sa première équipe de maintenance.','La plataforma está lista para su primer equipo de mantenimiento.','A plataforma está pronta para sua primeira equipe de manutenção.'],
 ['The old route stays open while we build the extension.','Původní trasa zůstává otevřená při stavbě rozšíření.','Die alte Route bleibt während des Ausbaus offen.','L’ancienne route reste ouverte pendant les travaux.','La ruta antigua permanece abierta durante la ampliación.','A rota antiga continua aberta durante a ampliação.'],
 ['Expand the network while keeping the rescue route open.','Rozšiř síť a udržuj záchrannou trasu otevřenou.','Erweitere das Netz und halte die Rettungsroute offen.','Étends le réseau tout en gardant la route de secours ouverte.','Amplía la red y mantén abierta la ruta de rescate.','Amplie a rede e mantenha a rota de resgate aberta.'],
 ['210 levels completed. The platform is ready. More network destinations are being prepared; you can revisit repairs and replay the story.','Dokončil jsi 210 levelů. Plošina je připravená. Další místa sítě chystáme; můžeš opakovat opravy a přehrát příběh.','210 Level abgeschlossen. Die Plattform ist bereit. Weitere Ziele im Netz sind in Arbeit. Du kannst Reparaturen und die Geschichte erneut spielen.','210 niveaux terminés. La plateforme est prête. D’autres destinations du réseau sont en préparation. Tu peux rejouer les réparations et l’histoire.','Has completado 210 niveles. La plataforma está lista. Preparamos más destinos de la red; puedes repetir reparaciones y la historia.','210 fases concluídas. A plataforma está pronta. Novos destinos da rede estão sendo preparados; você pode repetir os reparos e a história.'],
 ['Signal coupler','Signální spojka','Signalkoppler','Coupleur de signal','Acoplador de señal','Acoplador de sinal'],
 ['Solar wafer','Solární destička','Solarplatte','Plaquette solaire','Placa solar','Placa solar'],
 ['Optical lens','Optická čočka','Optische Linse','Lentille optique','Lente óptica','Lente óptica'],
 ['Ceramic insulator','Keramický izolátor','Keramikisolator','Isolant en céramique','Aislante cerámico','Isolador de cerâmica'],
 ['Service capsule','Servisní kapsle','Servicekapsel','Capsule de service','Cápsula de servicio','Cápsula de serviço'],
 ['Habitat cartridge','Obytná patrona','Habitatkartusche','Cartouche d’habitat','Cartucho de hábitat','Cartucho de habitat'],
 ['The first watch','První služba','Die erste Schicht','Le premier service','El primer turno','O primeiro turno'],
 ['Accept the new assignment','Přijmout nový úkol','Den neuen Auftrag annehmen','Accepter la nouvelle mission','Aceptar la nueva misión','Aceitar a nova missão'],
 ['The rescue is complete','Záchrana je dokončená','Die Rettung ist abgeschlossen','Le sauvetage est terminé','El rescate ha terminado','O resgate está concluído'],
 ['The expedition is home. The station closes the old distress call and keeps its record safe. This new assignment does not change their story.','Výprava je doma. Stanice uzavírá původní nouzové volání a uchovává jeho záznam. Nový úkol jejich příběh nemění.','Die Expedition ist zu Hause. Die Station schließt den alten Notruf ab und bewahrt ihn auf. Der neue Auftrag ändert ihre Geschichte nicht.','L’expédition est rentrée. La station clôt l’ancien appel de détresse et en conserve la trace. Cette nouvelle mission ne change pas leur histoire.','La expedición está en casa. La estación cierra la antigua llamada de socorro y conserva su registro. Esta nueva misión no cambia su historia.','A expedição está em casa. A estação encerra o antigo pedido de socorro e preserva seu registro. A nova missão não muda essa história.'],
 ['A supply ship again','Znovu zásobovací lodí','Wieder ein Versorgungsschiff','À nouveau un vaisseau de ravitaillement','De nuevo una nave de suministros','Uma nave de suprimentos de novo'],
 ['The operator asks us to deliver replacement modules to an outer service platform. A working network needs somewhere to maintain its equipment.','Operátor nás žádá o dodávku náhradních modulů na vnější servisní plošinu. Funkční síť potřebuje místo pro údržbu zařízení.','Der Operator bittet uns, Ersatzmodule zu einer äußeren Serviceplattform zu liefern. Ein funktionierendes Netz braucht einen Ort zur Wartung seiner Geräte.','L’opérateur nous demande de livrer des modules de rechange à une plateforme extérieure. Un réseau actif a besoin d’un lieu pour entretenir son matériel.','El operador nos pide llevar módulos de repuesto a una plataforma exterior. Una red activa necesita un lugar donde mantener sus equipos.','O operador pede a entrega de módulos de reposição a uma plataforma externa. Uma rede ativa precisa de um lugar para manter seus equipamentos.'],
 ['Build the next safe stop','Vybudovat další bezpečnou zastávku','Den nächsten sicheren Halt bauen','Construire la prochaine escale sûre','Construir la siguiente parada segura','Construir a próxima parada segura'],
 ['We will extend the network while the rescue route stays open. First take over the maintenance watch, then prepare the new platform for its first crew.','Rozšíříme síť a záchrannou trasu necháme otevřenou. Nejdřív převezmeme servisní službu a potom připravíme novou plošinu pro první posádku.','Wir erweitern das Netz, während die Rettungsroute offen bleibt. Übernimm zuerst den Wartungsdienst und bereite dann die neue Plattform für ihr erstes Team vor.','Nous étendrons le réseau sans fermer la route de secours. Prenons d’abord la relève, puis préparons la plateforme pour sa première équipe.','Ampliaremos la red sin cerrar la ruta de rescate. Primero tomaremos el relevo y después prepararemos la plataforma para su primera tripulación.','Vamos ampliar a rede sem fechar a rota de resgate. Primeiro assumiremos o turno de manutenção e depois prepararemos a plataforma para a primeira equipe.'],
];
const maps=Object.fromEntries(['en',...codes].map(code=>[code,{}]));
networkDraftLevels.forEach((r,i)=>['name','thought','result'].forEach((field,j)=>{
 const id=`network.level.${201+i}.${field}`;maps.en[id]=r[field];maps.cs[id]=r[{name:'csName',thought:'csThought',result:'csResult'}[field]];
 for(const code of codes.slice(1))maps[code][id]=editions[code][i][j];
}));
extra.forEach(([en,...values],i)=>{const id=`network.copy.${i}`;maps.en[id]=en;codes.forEach((code,n)=>maps[code][id]=values[n]);});
for(const [code,entries] of Object.entries(maps)){
 const path=`src/i18n/catalogs/runtime/${code}.json`,catalog=JSON.parse(readFileSync(path,'utf8'));
 Object.assign(catalog,entries);writeFileSync(path,JSON.stringify(catalog,null,2)+'\n');
}
console.log(`Registered ${Object.keys(maps.en).length} network messages in six editions.`);
