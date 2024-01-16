import { AsyncPipe, JsonPipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import {
  BoxAndWiskers,
  BoxPlotController,
} from '@sgratzl/chartjs-chart-boxplot'
import { CategoryScale, Chart, LinearScale } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { NgChartsConfiguration } from 'ng2-charts'
import { ToastServiceHostComponent } from '@stochus/daisy-ui'
import { NavbarComponent } from './navbar/navbar.component'

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    HttpClientModule,
    JsonPipe,
    NavbarComponent,
    ToastServiceHostComponent,
  ],
  providers: [
    {
      provide: NgChartsConfiguration,
      useValue: {
        generateColors: true,
        plugins: [DataLabelsPlugin],
      } satisfies NgChartsConfiguration,
    },
  ],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale)
  }
}
