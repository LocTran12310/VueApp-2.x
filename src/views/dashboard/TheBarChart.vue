<script lang="ts">
import Vue from "vue";
import { Bar, mixins } from "vue-chartjs";
import { ChartOptions } from "chart.js";
import { Component, Mixins, Prop } from "vue-property-decorator";
const { reactiveProp } = mixins;

@Component({
  extends: Bar,
})
export default class TheBarChart extends Mixins(reactiveProp, Bar) {
  @Prop() options!: ChartOptions;
  @Prop() datacollection!: any;

  mounted() {
    this.renderChart(this.datacollection, this.options);
  }
}
</script>
