#!/usr/bin/env bash
set -o errexit

bundle install
npm ci
bin/rails assets:precompile
bin/rails assets:clean
bin/rails db:prepare
bin/rails db:seed
