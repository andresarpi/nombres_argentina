Rails.application.routes.draw do
  get '/available_years', to: "main_controller#AvailableYears", as: "available_years"
  get '/names_by_year', to: "main_controller#NamesByYear"
  get '/names_by_year_with_rest', to: "main_controller#NamesByYearWithRest"
  

  get '/', to: 'static_pages#home'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
