module Api
  module V1
    class NotesController < ApplicationController
      before_action :set_lead, only: [:index, :create]
      before_action :set_note, only: [:destroy]

      def index
        notes = @lead.notes.includes(:user).order(created_at: :desc)

        render json: notes, each_serializer: NoteSerializer
      end

      def create
        note = @lead.notes.build(note_params)
        note.user = current_user

        if note.save
          render json: note, serializer: NoteSerializer, status: :created
        else
          render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @note.destroy

        head :no_content
      end

      private

      def set_lead
        @lead = Lead.find(params[:lead_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Lead not found" }, status: :not_found
      end

      def set_note
        @note = Note.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Note not found" }, status: :not_found
      end

      def note_params
        params.require(:note).permit(:body)
      end
    end
  end
end
