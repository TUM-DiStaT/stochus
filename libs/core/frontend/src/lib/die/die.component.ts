import { AsyncPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable, Subscription, shareReplay } from 'rxjs'

@Component({
  standalone: true,
  selector: 'stochus-die',
  templateUrl: './die.component.html',
  styleUrls: ['./die.component.scss'],
  imports: [AsyncPipe],
})
export class DieComponent implements OnDestroy {
  sides: undefined[][] = Array.from({ length: 6 }, (_, i) =>
    Array.from({ length: i + 1 }),
  )

  @Input()
  set value$(value$: Observable<number>) {
    this.value$Subscription?.unsubscribe()
    this.value$Subscription = value$.subscribe((value) => {
      this.shownSideSubject.next(value)
    })
  }
  private value$Subscription?: Subscription

  private shownSideSubject = new BehaviorSubject(1)
  shownSide$ = this.shownSideSubject.asObservable().pipe(shareReplay())

  ngOnDestroy() {
    this.value$Subscription?.unsubscribe()
  }

  getDotGridPositionClassNames(sideIndex: number, dotIndex: number) {
    // top left
    if (
      // 2, first dot
      (sideIndex === 1 && dotIndex === 0) ||
      // 3, first dot
      (sideIndex === 2 && dotIndex === 0) ||
      // 4, first dot
      (sideIndex === 3 && dotIndex === 0) ||
      // 5, first dot
      (sideIndex === 4 && dotIndex === 0) ||
      // 6, first dot
      (sideIndex === 5 && dotIndex === 0)
    ) {
      return 'col-start-1 row-start-1'
    }

    // top right
    if (
      // 4, third dot
      (sideIndex === 3 && dotIndex === 2) ||
      // 5, third dot
      (sideIndex === 4 && dotIndex === 2) ||
      // 6, fourth dot
      (sideIndex === 5 && dotIndex === 3)
    ) {
      return 'col-start-3 row-start-1'
    }

    // center left
    if (
      // 6, second dot
      sideIndex === 5 &&
      dotIndex === 1
    ) {
      return 'col-start-1 row-start-2'
    }

    // center
    if (
      // 1, first dot
      (sideIndex === 0 && dotIndex === 0) ||
      // 3, second dot
      (sideIndex === 2 && dotIndex === 1) ||
      // 5, fifth dot
      (sideIndex === 4 && dotIndex === 4)
    ) {
      return 'col-start-2 row-start-2'
    }

    // center right
    if (
      // 6, fifth dot
      sideIndex === 5 &&
      dotIndex === 4
    ) {
      return 'col-start-3 row-start-2'
    }

    // bottom left
    if (
      // 4, second dot
      (sideIndex === 3 && dotIndex === 1) ||
      // 5, second dot
      (sideIndex === 4 && dotIndex === 1) ||
      // 6, third dot
      (sideIndex === 5 && dotIndex === 2)
    ) {
      return 'col-start-1 row-start-3'
    }

    // bottom right
    if (
      // 2, second dot
      (sideIndex === 1 && dotIndex === 1) ||
      // 3, third dot
      (sideIndex === 2 && dotIndex === 2) ||
      // 4, fourth dot
      (sideIndex === 3 && dotIndex === 3) ||
      // 5, fourth dot
      (sideIndex === 4 && dotIndex === 3) ||
      // 6, sixth dot
      (sideIndex === 5 && dotIndex === 5)
    ) {
      return 'col-start-3 row-start-3'
    }

    throw new Error(`Cannot render side ${sideIndex} dot ${dotIndex}`)
  }
}
