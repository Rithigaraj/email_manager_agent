from flask import Blueprint, request, jsonify
from app.models import db, Template
from app.utils.auth_helpers import token_required

templates_bp = Blueprint('templates', __name__)

@templates_bp.route('', methods=['GET'])
@token_required
def get_templates(current_user):
    templates = Template.query.filter_by(user_id=current_user.id).order_by(Template.created_at.desc()).all()
    return jsonify({'templates': [t.to_dict() for t in templates]}), 200

@templates_bp.route('', methods=['POST'])
@token_required
def create_template(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    subject_template = data.get('subject_template', '').strip()
    body_template = data.get('body_template', '').strip()
    category = data.get('category', 'general')

    if not name or not subject_template or not body_template:
        return jsonify({'message': 'Name, subject template, and body template are required.'}), 400

    template = Template(
        user_id=current_user.id,
        name=name,
        subject_template=subject_template,
        body_template=body_template,
        category=category
    )
    db.session.add(template)
    db.session.commit()

    return jsonify({'message': 'Template created successfully!', 'template': template.to_dict()}), 201

@templates_bp.route('/<int:template_id>', methods=['DELETE'])
@token_required
def delete_template(current_user, template_id):
    template = Template.query.filter_by(id=template_id, user_id=current_user.id).first()
    if not template:
        return jsonify({'message': 'Template not found.'}), 404

    db.session.delete(template)
    db.session.commit()
    return jsonify({'message': 'Template deleted successfully!'}), 200
