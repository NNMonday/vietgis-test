import type Building from "../types/building";

const buildings: Building[] = [
  {
    name: "Bạch Mai Hospital",
    address:
      "78 Giải Phóng Street, Phương Mai Ward, Đống Đa District, Hà Nội, Việt Nam",
    coords: { lat: 21.00181, long: 105.8394 },
    representative: {
      name: "Nguyễn Văn A",
      phone: "0912345678",
      cccd: "012345678901",
      cccdIssuedDate: new Date("2020-05-10"),
    },
    id: 1757323161,
  },
  {
    name: "Bạch Mã Temple",
    address: "76 Hàng Buồm Street, Hoàn Kiếm District, Hà Nội, Việt Nam",
    coords: { lat: 21.03623, long: 105.85139 },
    representative: {
      name: "Trần Thị B",
      phone: "0987654321",
      cccd: "098765432109",
      cccdIssuedDate: new Date("2018-11-20"),
    },
    id: 1757323162,
  },
  {
    name: "Hanoi Opera House",
    address: "1 Tràng Tiền, Hoàn Kiếm District, Hà Nội, Việt Nam",
    coords: { lat: 21.02117, long: 105.85466 },
    representative: {
      name: "Lê Văn C",
      phone: "0901122334",
      cccd: "022334455667",
      cccdIssuedDate: new Date("2019-07-15"),
    },
    id: 1757323163,
  },
  {
    name: "Hanoi Towers",
    address:
      "49 Hai Bà Trưng Street, Trần Hưng Đạo Ward, Hoàn Kiếm District, Hà Nội, Việt Nam",
    coords: { lat: 21.02566, long: 105.845724 },
    representative: {
      name: "Phạm Thị D",
      phone: "0977123456",
      cccd: "031234567890",
      cccdIssuedDate: new Date("2022-03-15"),
    },
    id: 1757323164,
  },
  {
    name: "Lotte Center Hanoi",
    address: "Lotte Center, Ba Đình District, Hà Nội, Việt Nam",
    coords: { lat: 21.03235, long: 105.8126 },
    representative: {
      name: "Trần Văn E",
      phone: "0918765432",
      cccd: "045678901234",
      cccdIssuedDate: new Date("2021-08-01"),
    },
    id: 1757323165,
  },
  {
    name: "Landmark 72 (Keangnam Hanoi Landmark Tower)",
    address:
      "Plot E6, Cầu Giấy New Urban, Yên Hòa Ward, Cầu Giấy District, Hà Nội, Việt Nam",
    coords: { lat: 21.017324, long: 105.784054 },
    representative: {
      name: "Phùng Văn H",
      phone: "0901234567",
      cccd: "123456789012",
      cccdIssuedDate: new Date("2021-12-01"),
    },
    id: 1757323166,
  },
  {
    name: "Imperial Citadel of Thăng Long",
    address:
      "19C Hoàng Diệu Street, Điện Biên Ward, Ba Đình District, Hà Nội, Việt Nam",
    coords: { lat: 21.03944, long: 105.83722 },
    representative: {
      name: "Võ Thị K",
      phone: "0987654321",
      cccd: "210987654321",
      cccdIssuedDate: new Date("2019-06-15"),
    },
    id: 1757323167,
  },
  {
    name: "Vietnam National Convention Center",
    address:
      "57 Phạm Hùng Street, Mễ Trì Ward, Nam Từ Liêm District, Hà Nội, Việt Nam",
    coords: { lat: 21.00647, long: 105.78704 },
    representative: {
      name: "Đặng Văn T",
      phone: "0911122334",
      cccd: "112233445566",
      cccdIssuedDate: new Date("2020-09-05"),
    },
    id: 1757323168,
  },
  {
    name: "National Assembly Building (Nhà Quốc hội)",
    address:
      "1 Độc Lập Road, Quán Thánh Ward, Ba Đình District, Hà Nội, Việt Nam",
    coords: { lat: 21.03658, long: 105.83663 },
    representative: {
      name: "Phạm Thị U",
      phone: "0987766554",
      cccd: "223344556677",
      cccdIssuedDate: new Date("2021-02-18"),
    },
    id: 1757323169,
  },
  {
    name: "Vietnam National Museum of History",
    address: "1 Tràng Tiền Street, Hoàn Kiếm District, Hà Nội, Việt Nam",
    coords: { lat: 21.02472, long: 105.85972 },
    representative: {
      name: "Nguyễn Văn X",
      phone: "0911001122",
      cccd: "445566778899",
      cccdIssuedDate: new Date("2020-04-30"),
    },
    id: 1757323260,
  },
  {
    name: "Vietnam Military History Museum",
    address:
      "Km 6+500 Thăng Long Boulevard, Nam Từ Liêm District, Hà Nội, Việt Nam",
    coords: { lat: 21.01042, long: 105.75411 },
    representative: {
      name: "Lê Văn Z",
      phone: "0900667788",
      cccd: "667788990011",
      cccdIssuedDate: new Date("2019-05-22"),
    },
    id: 1757323261,
  },
  {
    name: "Temple of Literature (Văn Miếu - Quốc Tử Giám)",
    address:
      "58 Nguyễn Thái Học Street, Văn Miếu Quốc Tử Giám Ward, Hà Nội, Việt Nam",
    coords: { lat: 21.0286, long: 105.8356 },
    representative: {
      name: "Phạm Văn A",
      phone: "0912345670",
      cccd: "890123456789",
      cccdIssuedDate: new Date("2022-05-15"),
    },
    id: 1757323262,
  },
  {
    name: "Vietnam Museum of Ethnology",
    address:
      "Đường Nguyễn Văn Huyên, Nghĩa Đô, Cầu Giấy District, Hà Nội, Việt Nam",
    coords: { lat: 21.04039, long: 105.79884 },
    representative: {
      name: "Trần Thị B",
      phone: "0987654320",
      cccd: "901234567890",
      cccdIssuedDate: new Date("2021-09-01"),
    },
    id: 1757323263,
  },
];

export default buildings;
