export interface Machine {
  _id: string;
  type: string; //'washer','dryer'
  running: boolean;
  status: string; //Can be 'normal', 'broken', or 'invisible'
  room_id: string; //'gay_hall','independence_hall','spooner','blakely','green_prairie'
}
