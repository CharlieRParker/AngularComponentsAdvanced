import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';
import { TimerService } from './timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: [TimerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnInit, OnDestroy {

  @Output() onComplete = new EventEmitter<void>();
  @Input() init: number = 20;

  private countdownEndSubscription: Subscription = null;
  private countdownSubscription: Subscription = null;
  public countdown: number = 0;

  get progress() {
    console.log("getting fokin progress bruv");
    
    return (this.init - this.countdown) / this.init * 100
  }
  constructor(public timerSrv: TimerService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.timerSrv.restartCountdown(this.init);
    this.countdownEndSubscription = this.timerSrv.countdownEnd$.subscribe(() => {
      this.onComplete.emit();
      console.log("**--The countdown has finished--**");
    });
    this.countdownSubscription = this.timerSrv.countdown$.subscribe((data) => {
      this.countdown = data;
      this.cdRef.markForCheck();
    })
  }

  ngOnDestroy(): void {
    this.timerSrv.destroy();
    this.countdownEndSubscription.unsubscribe();
    this.countdownSubscription.unsubscribe();
  }


}
