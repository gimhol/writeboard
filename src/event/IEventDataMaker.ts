import { EventData } from "./EventData";

export interface IEventDataMaker<T = any> {
  pure(): EventData<T>;
}
