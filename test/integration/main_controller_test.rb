require 'test_helper'

class MainControllerTest < ActionDispatch::IntegrationTest
  test 'avalable years' do
    ENV["RAILS_ENV"] = 'development'
    get available_years_path
    response = JSON.parse(@response.body)
    assert(response[0] == 2014) || (response[0] == 2015)
  end
  
end
