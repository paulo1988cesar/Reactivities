import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    
    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort((a, b) => a.date.getDate() - b.date.getDate());
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
          }, {} as {[key: string]: IActivity[]}));
    }

    //carrega todas as atividades
    @action loadActivities = async () => {
        this.loadingInitial = true;
        
        try {
            const activities = await agent.Activities.list();
            
            runInAction('loading activities', () => {
                activities.forEach((activity: IActivity) => {
                    //activity.date = activity.date.toISOString().split(".")[0].split("T")[0];
                    activity.date = new Date(activity.date);
                    this.activityRegistry.set(activity.id, activity);
                });
            })
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction('loading activities error', () => {
            this.loadingInitial = false
            })
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
          this.activity = activity;
          return activity;
        } else {
          this.loadingInitial = true;
          try {
            activity = await agent.Activities.details(id);
            runInAction('getting activity',() => {
              activity.date = new Date(activity.date);
              this.activity = activity;
              this.activityRegistry.set(activity.id, activity);
              this.loadingInitial = false;
            })
            return activity;
          } catch (error) {
            runInAction('get activity error', () => {
              this.loadingInitial = false;
            })
            console.log(error);
          }
        }
    }
    
    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    //Seleciona as atividades por id
    @action selectActivity= (id: string) => {
        this.activity = this.activityRegistry.get(id);
        
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.create(activity)
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
            })
            toast.success("Activity saved successfully");
            history.push(`/activities/${activity.id}`);
        }
        catch (error){
            console.log(error);
            toast.error('Error: ' + error.response);
        }
        finally{
            runInAction('creating activity error', () => {
                this.submitting = false;
            })
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            })
            toast.success("Activity saved successfully");
            history.push(`/activities/${activity.id}`);
        }
        catch (error) {
            console.log(error);
            toast.error('Error: ' + error.response);           
        }
        finally {
            runInAction('editing activity error', () => {
                this.submitting = false;
            })     
        }
    }
    
    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction('deleting activity error', () => {
                this.submitting = false;
                this.target = '';
            });
        }
    }    
}