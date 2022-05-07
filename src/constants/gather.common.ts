export enum RowStatus {
  Created = 1,
  Modified = 2,
  Deleted = 3
}

export enum Side {
  Left = 1,
  Right = 2,
  Unknown = 0
}

export enum StructureTypes {
  Aisle = 1,
  Rack = 2,
  Bin = -1,
  Unknown = 0
}

export enum MissionStatus {
  Scheduled = 1, 
  InFlight = 2, 
  OnHold = 3, 
  Completed = 4, 
  Aborted = 5, 
  Failed = 6
}

export enum SetupUser {
  Admin = 1
}

export enum MemberType {
  Admin = 1,
  Manager = 2,
  Member = 3
}

export default class Defaults {
  static readonly BIN_ID: number = 0;
  static readonly PRODUCT_ID: number = 0;
}