<template>
  <div>
    <v-card class="pb-4">
      <v-card-title>
        {{ $t("course.titleDetail") }}
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="form">
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.name") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.name }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.courseType") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{
                course.course_type == "1"
                  ? $t("course.courseTypes.course")
                  : $t("course.courseTypes.event")
              }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.time") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.time }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.weekdays") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.weekdays }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.startDate") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.start_date }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.endDate") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.end_date }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.note") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.note }}
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row dense class="mt-4">
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.updatedTime") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.updated_time }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.updatedUser") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.updated_user }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.createdTime") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.created_time }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text mb-8 pl-8"
              >{{ $t("course.createdUser") }}</v-col
            >
            <v-col cols="12" sm="7" md="5" class="body-1 black--text mb-8 pl-8">
              {{ course.created_user }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="amber darken-2 white--text" @click="cancelCourse">
            <v-icon dense left>mdi-close</v-icon>
            {{ $t("course.btnCancel") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class CourseDetail extends Vue {
  cancelCourse() {
    this.$router.back();
  }
  get course() {
    return store.state.courses.items.find(
      (course: any) => course.id === parseInt(this.$route.params.id)
    );
  }
}
</script>
