# AI Log - Etapa 4: Componente construite din date

**Data:** Octombrie 2026 **Student:** Moraru Robert Luca **Proiect:** DeviceVault (Smart Home Hub)

## 1. Obiectivul Etapei

Modularizarea panoului principal prin crearea a două componente React (`DeviceCard` și `DeviceList`), randarea dinamică
a listei cu `map()`, utilizarea atributului `key={device.id}` și tratarea cazului de listă goală prin randare
condiționată.

## 2. Prompts utilizate și decizii tehnice

- **Prompt:** „hai sa rezolvam corect aceasta etapa adaptata la proiectul meu”
- **Decizie tehnică:** Împărțirea grid-ului de dispozitive în `DeviceCard.jsx` (preia datele fiecărui nod IoT via props
  și adaptează clasele CSS în funcție de `device.online`) și `DeviceList.jsx` (validează lungimea array-ului și apelează
  `map()`).
- **Prevenire erori:** Plasarea corectă a cheii `key={device.id}` pe instanța `<DeviceCard />` din `map`, evitând
  avertismentele de reconciliere din consola browserului.

## 3. Concluzii

Interfața este complet decuplată de date: adăugarea sau eliminarea unui obiect din array-ul `initialDevices`
actualizează automat numărul de carduri generate, respectând cerințele baremului Etapa 4.