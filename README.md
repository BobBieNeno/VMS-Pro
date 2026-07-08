# VMS Office — Vehicle Management System

ระบบจัดการข้อมูลรถยนต์ (Frontend: React + Vite, Backend: Node.js/Express)
ออกแบบ UI ตาม mockup จาก Google Stitch — สไตล์ SaaS dashboard สีขาว/ฟ้า

## โครงสร้างโปรเจกต์

```
vms-project/
├── backend/     # Node.js + Express REST API (layered architecture)
└── frontend/    # React + Vite SPA
```

## Functional Requirements ที่ครอบคลุม

| # | Requirement | Endpoint | หน้าจอ |
|---|---|---|---|
| 1 | เพิ่มข้อมูลรถยนต์ใหม่ | `POST /api/vehicles` | ปุ่ม "+ เพิ่มรถยนต์ใหม่" → Modal ฟอร์ม |
| 2 | ดูข้อมูลรถยนต์ทั้งหมด | `GET /api/vehicles` | ตารางหน้าหลัก + ค้นหา + pagination |
| 3 | แก้ไขข้อมูลรถยนต์ | `PUT /api/vehicles/:id` | ปุ่มไอคอนดินสอ → Modal ฟอร์ม (prefilled) |
| 4 | ลบข้อมูลรถยนต์ | `DELETE /api/vehicles/:id` | ปุ่มไอคอนถังขยะ → Dialog ยืนยัน |

ข้อมูลแต่ละคัน: `licensePlate` (ทะเบียน), `brand` (ยี่ห้อ), `model` (รุ่น), `note` (หมายเหตุ, optional)

---

## Backend

### สถาปัตยกรรม (Layered Architecture)

```
backend/src/
├── routes/          → รับ HTTP request, map ไป controller
├── controllers/      → parse request → call service → format response (ไม่มี business logic)
├── services/          → business logic ทั้งหมด (validation ทางธุรกิจ, duplicate check ฯลฯ)
├── repositories/      → data access ชั้นเดียวที่แตะ storage โดยตรง
├── validators/         → payload shape validation (ก่อนเข้าสู่ controller)
├── middlewares/        → validateRequest, errorHandler (centralized)
├── utils/               → ApiError, response formatter
└── config/prisma.js     → Prisma Client + Neon PostgreSQL adapter
```

หมายเหตุ: ตอนนี้ backend ใช้ Prisma เชื่อม Neon PostgreSQL ผ่าน `DATABASE_URL` แล้ว ทุก query อยู่ใน
`vehicle.repository.js` ไฟล์เดียว โดย service/controller/route ไม่แตะฐานข้อมูลโดยตรง

### Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push    # run after setting DATABASE_URL to your Neon PostgreSQL connection string
npm run dev        # http://localhost:4000 (nodemon, auto-reload)
```

### API Endpoints

| Method | Path | Body | คำอธิบาย |
|---|---|---|---|
| GET | `/api/vehicles?search=` | - | ดึงรายการทั้งหมด (filter ได้จากทะเบียน/ยี่ห้อ/รุ่น) |
| GET | `/api/vehicles/:id` | - | ดึงข้อมูลรถยนต์คันเดียว |
| POST | `/api/vehicles` | `{licensePlate, brand, model, note?}` | เพิ่มรถยนต์ใหม่ |
| PUT | `/api/vehicles/:id` | `{licensePlate?, brand?, model?, note?}` | แก้ไขข้อมูล (partial update ได้) |
| DELETE | `/api/vehicles/:id` | - | ลบข้อมูล |

Response format (ทุก endpoint):
```json
{ "success": true, "message": "...", "data": { ... }, "meta": { "total": 24 } }
```

### Testing

```bash
npm test              # รัน unit + integration tests พร้อม coverage report
```

ครอบคลุม:
- **Unit tests** — `vehicle.validator.test.js`, `vehicle.service.test.js` (mock repository layer)
- **Integration tests** — `vehicle.api.integration.test.js` (supertest, ยิง HTTP request จริงผ่าน Express app ทั้งตัว)

ผลลัพธ์ปัจจุบัน: **27 tests ผ่านทั้งหมด, coverage ~92%**

---

## Frontend

### โครงสร้าง

```
frontend/src/
├── api/vehicleApi.js       → fetch wrapper คุยกับ backend
├── hooks/useVehicles.js    → state management (CRUD + search, debounced)
├── components/
│   ├── Sidebar/            → เมนูซ้าย (Fleet, Maintenance, Drivers, Reports)
│   ├── Navbar/              → ค้นหา + ปุ่มเพิ่มรถยนต์
│   ├── VehicleTable/         → ตารางข้อมูล + skeleton loading state
│   ├── VehicleModal/          → ฟอร์ม เพิ่ม/แก้ไข (ใช้ component เดียวกันทั้งสองโหมด)
│   ├── DeleteConfirmDialog/    → dialog ยืนยันการลบ
│   ├── EmptyState/              → หน้าว่างเมื่อยังไม่มีข้อมูล / ค้นหาไม่เจอ
│   ├── Pagination/                → แบ่งหน้า 10 รายการ/หน้า
│   └── Toast/                      → แจ้งเตือนสำเร็จ/ผิดพลาด มุมขวาบน
└── pages/VehicleListPage.jsx    → ประกอบทุก component เข้าด้วยกัน
```

### Setup

```bash
cd frontend
npm install
cp .env.example .env      # ตั้งค่า VITE_API_BASE_URL ให้ชี้ไป backend
npm run dev                # http://localhost:5173 (proxy /api ไป backend:4000 อัตโนมัติ)
```

### Testing

```bash
npm test        # vitest + React Testing Library
```

ครอบคลุม `VehicleTable`, `VehicleModal` (validation, submit, prefill), `DeleteConfirmDialog`
— **15 tests ผ่านทั้งหมด**

### Design tokens

สี/spacing/radius ทั้งหมดอยู่ใน `src/styles/tokens.css` เป็น CSS variables ตาม design system จาก Stitch
(Primary `#2563EB`, Success `#16A34A`, Danger `#DC2626`) เปลี่ยนธีมได้จากไฟล์เดียว

---

## รันพร้อมกันทั้งคู่ (Local Dev)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

เปิด http://localhost:5173

---

## Code Review Checklist (สำหรับทีม)

- [ ] Controller ไม่มี business logic (อยู่ที่ service เท่านั้น)
- [ ] Repository เป็นจุดเดียวที่แตะ storage
- [ ] ทุก endpoint ใหม่มี validator + unit test คู่กัน
- [ ] Error ทุกจุด throw ผ่าน `ApiError` ไม่ throw string/object เปล่า
- [ ] Component ใหม่ฝั่ง frontend มี test ไฟล์คู่กันใน `tests/`
- [ ] ไม่มี business logic ปนอยู่ใน component (ใช้ hook แยกถ้าซับซ้อน)
- [ ] รัน `npm test` ผ่านทั้ง backend และ frontend ก่อน merge
