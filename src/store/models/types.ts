import { MutationPayload } from "vuex";

//STORE
export interface RootState {
  alert: AlertState;
  user: UserState;
  profiles: ProfilesState;
  courses: CoursesState;
  positions: PositionsState;
  departments: DepartmentsState;
  history: HistoryState;
}

export interface UserState {
  user: any;
  isLoggedIn: boolean;
}

export interface AlertState {
  snackBarAlert: {
    isShow: boolean;
    icon: string;
    message: string;
    color: string;
    timeOut: number;
  };
}

export interface ProfilesState {
  items: any;
}

export interface CoursesState {
  items: any;
  courseParticipants: any;
}

export interface PositionsState {
  items: any;
}

export interface DepartmentsState {
  items: any;
}

export interface HistoryState {
  history: MutationPayload[];
}

export interface PluginOptions {
  persist?: boolean;
}
