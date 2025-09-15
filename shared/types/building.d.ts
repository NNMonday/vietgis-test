type Building = {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; long: number };
  representative: {
    name: string;
    phone: string;
    cccd: string;
    cccdIssuedDate: Date;
  };
};

export default Building;
