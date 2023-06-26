import { NgTemplateOutlet } from "@angular/common";

export interface User {
    uid: string;
    displayName?: string | null;
    email: string | null;
    reservations?: string[];
}
