module Api
  module V1
    class LeadsController < ApplicationController
      before_action :set_lead, only: [:show, :update, :destroy]

      def index
        leads = filter_leads

        render json: { data: ActiveModel::Serializer::CollectionSerializer.new(leads, serializer: LeadSerializer, include: [:owner]) }
      end

      def show
        render json: @lead, serializer: LeadSerializer, include: [:owner, :tasks, :notes]
      end

      def create
        lead = current_user.leads.build(lead_params)

        if lead.save
          render json: lead, serializer: LeadSerializer, include: [:owner], status: :created
        else
          render json: { errors: lead.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        authorize_lead!(@lead)

        if @lead.update(lead_params)
          render json: @lead, serializer: LeadSerializer, include: [:owner], status: :ok
        else
          render json: { errors: @lead.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize_lead!(@lead)
        @lead.destroy

        head :no_content
      end

      private

      def filter_leads
        leads = current_user.manager? ? Lead.all : current_user.leads

        leads = leads.where(status: params[:status]) if params[:status].present?
        leads = leads.where(source: params[:source]) if params[:source].present?
        leads = leads.where("title ILIKE ? OR company ILIKE ? OR contact_name ILIKE ?", "%#{params[:q]}%", "%#{params[:q]}%", "%#{params[:q]}%") if params[:q].present?

        leads.includes(:owner).order(created_at: :desc)
      end

      def set_lead
        @lead = Lead.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Lead not found" }, status: :not_found
      end

      def lead_params
        params.require(:lead).permit(:title, :company, :contact_name, :email, :phone, :status, :source, :address, :latitude, :longitude, :description)
      end

      def authorize_lead!(lead)
        render json: { error: "Unauthorized" }, status: :forbidden unless current_user.manager? || lead.owner_id == current_user.id
      end
    end
  end
end