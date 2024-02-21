# frozen_string_literal: true

# == Schema Information
#
# Table name: notification_policies
#
#  id                      :bigint(8)        not null, primary key
#  account_id              :bigint(8)        not null
#  filter_not_following    :boolean          default(FALSE), not null
#  filter_not_followers    :boolean          default(FALSE), not null
#  filter_new_accounts     :boolean          default(FALSE), not null
#  filter_private_mentions :boolean          default(TRUE), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class NotificationPolicy < ApplicationRecord
  belongs_to :account

  attr_reader :pending_requests_count, :pending_notifications_count

  def summarize!
    @pending_requests_count, @pending_notifications_count = NotificationRequest.where(account: account, dismissed: false).limit(100).pick(Arel.sql('count(*), coalesce(sum(notifications_count), 0)::bigint'))
  end
end
