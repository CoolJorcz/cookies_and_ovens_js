class CreateBatchs < ActiveRecord::Migration
  def change
    create_table :batches do |t|
      t.string  :cookie_type, index: true, null: false
      t.string  :cookie_status, default: 'raw'
      t.string  :location, default: 'prep_table'
      t.integer :bake_time, null: false
      t.integer :time_baked, default: 0
      t.timestamps
    end
  end
end
