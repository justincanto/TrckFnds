import { ConnectionType } from "@trckfnds/shared";

export interface ConnectionSource {
  id?: number;
  name: string;
  logo?: string;
  popular?: boolean;
  connectionType: ConnectionType;
}
