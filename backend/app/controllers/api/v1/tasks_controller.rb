module Api
  module V1
    class TasksController < ApplicationController
      before_action :set_lead, only: [:index, :create]
      before_action :set_task, only: [:update, :destroy]

      def index
        tasks = @lead.tasks.includes(:user)

        render json: tasks, each_serializer: TaskSerializer
      end

      def create
        task = @lead.tasks.build(task_params)
        task.user = current_user

        if task.save
          render json: task, serializer: TaskSerializer, status: :created
        else
          render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @task.update(task_params)
          render json: @task, serializer: TaskSerializer, status: :ok
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @task.destroy

        head :no_content
      end

      private

      def set_lead
        @lead = Lead.find(params[:lead_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Lead not found" }, status: :not_found
      end

      def set_task
        @task = Task.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Task not found" }, status: :not_found
      end

      def task_params
        params.require(:task).permit(:title, :due_date, :status)
      end
    end
  end
end
