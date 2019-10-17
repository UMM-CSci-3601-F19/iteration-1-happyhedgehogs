export interface Machine {
  id: string;
  name: string;
  type: string; //'washer','dryer'
  running: boolean;
  status: string; //Can be 'normal', 'broken', or 'invisible'
  position: {
    x: number;
    y: number;
  };
  room_id: string; //'gay','independence','spooner','blakely','green_prairie', 'the_apartments'
}
