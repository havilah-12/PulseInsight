from marshmallow import Schema, fields, validate

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)  # Auto-generated, not needed in POST
    text = fields.String(
        required=True,
        validate=[validate.Length(min=1, max=250)]
    )
