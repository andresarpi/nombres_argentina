class MainControllerController < ApplicationController
  before_action :set_cache_headers



  
  def AvailableYears
    years = YearAggregateInfo.distinct.order(year: :desc).pluck(:year)
    render json: years
  end

  def NamesByYear
    if params[:year].nil?
      render :json => { :errors => "Year parameter not defined" }, :status => 400
    end
    
    object = NameCount.select(:name, :count).where("year = ?", params[:year]).order(count: :desc).limit(8)
    
    render json: object
  end

  def NamesByYearWithRest
    if params[:year].nil?
      render :json => { :errors => "Year parameter not defined" }, :status => 400
    end
    
    array = NameCount.select(:name, :count).where("year = ?", params[:year]).order(count: :desc).limit(7).to_a
    
    object = {}
    object[:id] = nil
    object[:name] = "rest"
    object[:count] = YearAggregateInfo.select(:rest_count).where("year = ?", params[:year])[0][:rest_count]
    
    array.unshift(object)
    
    render json: array
    
  end

  
  def NameThroughYears
    if params[:name].nil?
      render :json => { :errors => "Name parameter not defined" }, :status => 400
    end

    array = NameCount.select(:year, :count, :name).where("name = ?", params[:name]).order(year: :asc).limit(8)
    render json: array
  end
  
  
  private

    def set_cache_headers
        response.headers["Cache-Control"] = "no-cache, no-store"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
    end
end
