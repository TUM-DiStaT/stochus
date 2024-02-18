import { AsyncPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { random } from 'lodash'
import {
  BehaviorSubject,
  Observable,
  Subscription,
  scan,
  shareReplay,
} from 'rxjs'

const baseRotations: Record<
  number,
  {
    x: number
    y: number
    z: number
  }
> = {
  1: { x: 0, y: 0, z: 0 },
  2: { x: 180, y: 0, z: 0 },
  3: { x: 0, y: 90, z: 0 },
  4: { x: -90, y: 0, z: 0 },
  5: { x: 90, y: 0, z: 0 },
  6: { x: 0, y: -90, z: 0 },
}

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

  rotation$ = this.shownSide$.pipe(
    scan(
      (previousRotations, side) => {
        const getRotation = (oldRotation: number) => {
          const oldSign = Math.sign(oldRotation)
          const sign =
            oldSign !== 0 ? -1 * oldSign : random(0, 1) === 0 ? -1 : 1
          return sign * random(1, 3) * 360
        }

        return {
          x: baseRotations[side].x + getRotation(previousRotations.x),
          y: baseRotations[side].y + getRotation(previousRotations.y),
          z: baseRotations[side].z + getRotation(previousRotations.z),
        }
      },
      {
        x: 0,
        y: 0,
        z: 0,
      },
    ),
  )

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
