module Admin
  class WelcomeController < Admin::ApplicationController
    layout "admin"

    def index
      @daily_threads = Article.where("title LIKE 'Welcome Thread - %'")
    end

    def create
      welcome_thread = Article.create(
        body_markdown: welcome_thread_content,
        user: User.dev_account,
      )
      redirect_to "#{URI.parse(welcome_thread.path).path}/edit"
    end

    private

    def welcome_thread_content
      <<~HEREDOC
        ---
        title: Welcome Thread - v0
        published: false
        description: Introduce yourself to the community!
        tags: welcome
        ---

        Hey there! Welcome to #{ApplicationConfig['COMMUNITY_NAME']}!

        ![WELCOME TO THE INTERNET](https://slack-imgs.com/?c=1&url=http%3A%2F%2Fmedia0.giphy.com%2Fmedia%2FzhbrTTpmSCYog%2Fgiphy-downsized.gif)

        Leave a comment below to introduce yourself to the community!✌️
      HEREDOC
    end
  end
end
