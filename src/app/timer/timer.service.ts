import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class TimerService {

    private countdownTimerRef: any = null;
    public paused: boolean = true;
    private init: number = 0;
    private countdownEndSource = new Subject<void>();
    private countdownSource = new BehaviorSubject<number>(0);
    public countdownEnd$ = this.countdownEndSource.asObservable();
    public countdown$ = this.countdownSource.asObservable();

    constructor() { }

    destroy(): void {
        this.clearTimeout();
    }

    restartCountdown(init?) {
        if (init)
            this.init = init;
        if (this.init && this.init > 0) {
            this.paused = true;
            this.clearTimeout();
            this.countdownSource.next(this.init);
        }
    }

    doCountdown() {
        this.countdownTimerRef = setTimeout(() => {
            this.countdownSource.next(this.countdownSource.getValue() - 1);
            this.processCountdown();
        }, 1000);
    }

    processCountdown() {
        if (this.countdownSource.getValue() <= 0) {
            this.countdownEndSource.next();
        }
        else {
            this.doCountdown();
        }
    }

    clearTimeout() {
        if (this.countdownTimerRef) {
            clearTimeout(this.countdownTimerRef);
            this.countdownTimerRef = null;
        }
    }

    toggleCountdown() {
        this.paused = !this.paused;
        if (this.paused == false) {
            this.doCountdown();
        } else {
            this.clearTimeout();
        }
    }

}