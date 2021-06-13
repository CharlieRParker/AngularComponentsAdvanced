import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { SimpleAlertViewComponent } from './simple-alert-view/simple-alert-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit, AfterViewInit {

  public isAddTimerVisible: boolean = false;

  public time: number = 0;
  public timers: Array<number> = [];

  @ViewChild("timerInput") timeInput: ElementRef;
  @ViewChild("alert", { read: ViewContainerRef }) alertContainer: ViewContainerRef;
  public simpleAlert: ComponentRef<SimpleAlertViewComponent> = null;

  constructor(private cdRef: ChangeDetectorRef, private renderer: Renderer2, private resolver: ComponentFactoryResolver) {
    this.timers = [3, 65, 120, 360]
  }
  ngAfterViewInit(): void {
    console.log(this.timeInput);
    //en cualquier entorno
    this.renderer.setAttribute(this.timeInput.nativeElement, "placeholder", "enter seconds")
    this.renderer.addClass(this.timeInput.nativeElement, "time-input");
    //si usamos browser
    // this.timeInput.nativeElement.setAttribute("placeholder", "enter seconds");
    // this.timeInput.nativeElement.classList.add("time-input");

    this.cdRef.detectChanges();
  }
  ngAfterContentInit(): void {

  }

  public logCountdownEnd() {
    console.log("***--Countdown Done--***");
  }

  public showAddTimer() {
    this.isAddTimerVisible = true;
    setTimeout(() => {
      //para todos entornos
      this.renderer.selectRootElement(this.timeInput.nativeElement).focus();
      // browser
      // this.timeInput.nativeElement.focus();
    });
  }

  public hideAddTimer() {
    this.isAddTimerVisible = false;
  }

  public showEndTimerAlert() {
    const alertFactory = this.resolver.resolveComponentFactory(SimpleAlertViewComponent);
    this.simpleAlert = this.alertContainer.createComponent(alertFactory);
    this.simpleAlert.instance.title = "Timer Ended Bitx";
    this.simpleAlert.instance.message = "The bomb has been planted";
    this.simpleAlert.instance.onDismiss.subscribe(() => {
      this.simpleAlert.destroy();
    });
    this.simpleAlert.instance.show();
  }


  public submitAddTimer() {
    this.timers.push(this.time);
    this.hideAddTimer();
  }
}

