// shared-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {
    private file: File | null = null;
    private jdText: string = '';

    setFile(file: File) {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
    }

    setJD(jd: string) {
        this.jdText = jd;
    }

    getJD(): string {
        return this.jdText;
    }

    clearData() {
        this.file = null;
        this.jdText = '';
    }
}
