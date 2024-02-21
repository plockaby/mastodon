# frozen_string_literal: true

# == Schema Information
#
# Table name: notification_requests
#
#  id                  :bigint(8)        not null, primary key
#  account_id          :bigint(8)        not null
#  from_account_id     :bigint(8)        not null
#  last_status_id      :bigint(8)        not null
#  notifications_count :bigint(8)        default(0), not null
#  dismissed           :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class NotificationRequest < ApplicationRecord
  include Paginable

  belongs_to :account
  belongs_to :from_account, class_name: 'Account'
  belongs_to :last_status, class_name: 'Status'

  before_save :prepare_notifications_count

  def self.preload_cache_collection(requests)
    # Call cache_collection in block
    cached_statuses_by_id = yield(requests.filter_map(&:last_status)).index_by(&:id)

    requests.each do |request|
      request.last_status = cached_statuses_by_id[request.last_status_id] unless request.last_status_id.nil?
    end
  end

  private

  def prepare_notifications_count
    self.notifications_count = Notification.where(account: account, from_account: from_account).limit(100).count
  end
end
