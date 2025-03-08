import { ConnectionType } from "@trck-fnds/shared";

export interface ConnectionSource {
  id?: number;
  name: string;
  logo?: string;
  popular?: boolean;
  connectionType: ConnectionType;
}
