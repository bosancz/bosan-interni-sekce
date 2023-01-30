import { AcRouteEntity } from "./ac-route-entity";

export type RouteStoreItem = {
  entity: AcRouteEntity<any>;
  method: string | symbol;
  controller: any;
  handler: any;
};

export const RouteStore: RouteStoreItem[] = [];
