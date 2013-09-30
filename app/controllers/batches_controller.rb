class BatchesController < ApplicationController
  def show
    batch = Batch.find(params[:id])
    render json: batch
  end

  def create
    batch = Batch.new
    batch.cookie_type = params[:cookie_type]
    batch.bake_time = params[:bake_time]
    batch.save
    render text: batch.id
  end

  def update
    batch = Batch.find(params[:id])
    batch.location = params[:location] if params[:location]
    batch.cookie_status = params[:cookie_status] if params[:cookie_status]
    batch.save
    render json: batch
  end

  def prep_table
    render json: Batch.find_all_by_location('prep_table')
  end

  def rack
    render json: {batch: Batch.find_by_location("#rack_" + params[:id]), j: params[:id]}
  end

  def displaycase
    render json: Batch.find_all_by_location('displaycase')
  end
end
