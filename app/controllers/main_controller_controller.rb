class MainControllerController < ApplicationController
  
  def AvailableYears
    years = YearAggregateInfo.distinct.order(year: :desc).pluck(:year)
    render json: years
  end

  def NamesByYear
    if params[:year].nil?
      render :json => { :errors => "Year parameter not defined" }, :status => 400
    end
    
    object = {}
    object[:top_10] = NameCount.select(:name, :count).order(count: :desc).limit(10)
    
    render json: object
  end
  
  def NamesByYearWithRest
    if params[:year].nil?
      render :json => { :errors => "Year parameter not defined" }, :status => 400
    end
    
    object = {}
    object[:rest] = YearAggregateInfo.select(:rest_count).where("year = ?", params[:year])[0][:rest_count]
    object[:top_10] = NameCount.select(:name, :count).order(count: :desc).limit(10)
    
    render json: object
    
  end
end
