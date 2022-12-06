resource "aws_dynamodb_table" "aws_dynamodb_recipes" {
  name         = "recipes-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "__ttd"
    enabled        = true
  }

  lifecycle {
    prevent_destroy = false
  }

  timeouts {
    update = "30m"
  }
}
