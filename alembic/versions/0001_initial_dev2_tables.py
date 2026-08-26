"""initial dev2 tables

Revision ID: 0001_initial_dev2_tables
Revises: 
Create Date: 2026-08-18
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial_dev2_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # expenses
    op.create_table(
        'expenses',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=False, index=True),
        sa.Column('farm_id', sa.Integer, nullable=False, index=True),
        sa.Column('field_id', sa.Integer, nullable=True, index=True),
        sa.Column('crop_id', sa.Integer, nullable=True, index=True),
        sa.Column('category', sa.Enum('SEEDS','FERTILIZER','LABOR','IRRIGATION','EQUIPMENT','TRANSPORTATION','STORAGE','OTHER', name='expensecategory'), nullable=False),
        sa.Column('amount', sa.Numeric(12,2), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('expense_date', sa.Date, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # market_prices
    op.create_table(
        'market_prices',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('crop_name', sa.String(255), nullable=False, index=True),
        sa.Column('market_name', sa.String(255), nullable=False, index=True),
        sa.Column('location', sa.String(255), nullable=True),
        sa.Column('price', sa.Numeric(12,4), nullable=False),
        sa.Column('unit', sa.String(64), nullable=True),
        sa.Column('price_date', sa.Date, nullable=False, index=True),
        sa.Column('source', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # price_predictions
    op.create_table(
        'price_predictions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=True, index=True),
        sa.Column('crop', sa.String(255), nullable=False, index=True),
        sa.Column('market', sa.String(255), nullable=False, index=True),
        sa.Column('prediction_date', sa.DateTime, nullable=False),
        sa.Column('horizon', sa.Integer, nullable=False),
        sa.Column('predicted_prices', sa.JSON, nullable=False),
        sa.Column('unit', sa.String(64), nullable=True),
        sa.Column('model_version', sa.String(128), nullable=True),
        sa.Column('metadata', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # profitability_records
    op.create_table(
        'profitability_records',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=False, index=True),
        sa.Column('farm_id', sa.Integer, nullable=True),
        sa.Column('field_id', sa.Integer, nullable=True),
        sa.Column('crop_id', sa.Integer, nullable=True),
        sa.Column('predicted_yield', sa.Numeric(12,4), nullable=True),
        sa.Column('expected_price', sa.Numeric(12,4), nullable=True),
        sa.Column('total_cost', sa.Numeric(12,4), nullable=True),
        sa.Column('expected_revenue', sa.Numeric(12,4), nullable=True),
        sa.Column('expected_profit', sa.Numeric(12,4), nullable=True),
        sa.Column('profit_margin', sa.Numeric(8,4), nullable=True),
        sa.Column('break_even_price', sa.Numeric(12,4), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # risk_assessments
    op.create_table(
        'risk_assessments',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=False, index=True),
        sa.Column('farm_id', sa.Integer, nullable=True),
        sa.Column('field_id', sa.Integer, nullable=True),
        sa.Column('crop_id', sa.Integer, nullable=True),
        sa.Column('disease_risk', sa.String(32), nullable=True),
        sa.Column('yield_risk', sa.String(32), nullable=True),
        sa.Column('market_risk', sa.String(32), nullable=True),
        sa.Column('financial_risk', sa.String(32), nullable=True),
        sa.Column('overall_risk', sa.String(32), nullable=True),
        sa.Column('risk_score', sa.Float, nullable=True),
        sa.Column('explanation', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=False, index=True),
        sa.Column('type', sa.String(64), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('reference_type', sa.String(64), nullable=True),
        sa.Column('reference_id', sa.Integer, nullable=True),
        sa.Column('is_read', sa.Boolean, nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # ai_conversations
    op.create_table(
        'ai_conversations',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, nullable=False, index=True),
        sa.Column('conversation_id', sa.String(128), nullable=False, unique=True),
        sa.Column('metadata', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # ai_messages
    op.create_table(
        'ai_messages',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('conversation_id', sa.String(128), nullable=False, index=True),
        sa.Column('sender', sa.String(32), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('message_type', sa.String(64), nullable=True),
        sa.Column('sources', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # knowledge_documents
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('doc_type', sa.String(64), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('chunks', sa.JSON, nullable=True),
        sa.Column('embedding_ref', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    # model_registry
    op.create_table(
        'model_registry',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('model_name', sa.String(255), nullable=False),
        sa.Column('model_type', sa.String(64), nullable=False),
        sa.Column('version', sa.String(64), nullable=False),
        sa.Column('dataset_name', sa.String(255), nullable=True),
        sa.Column('dataset_size', sa.Integer, nullable=True),
        sa.Column('metric_name', sa.String(64), nullable=True),
        sa.Column('metric_value', sa.Float, nullable=True),
        sa.Column('training_date', sa.DateTime, nullable=True),
        sa.Column('status', sa.String(64), nullable=True),
        sa.Column('model_path', sa.String(1024), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table('model_registry')
    op.drop_table('knowledge_documents')
    op.drop_table('ai_messages')
    op.drop_table('ai_conversations')
    op.drop_table('notifications')
    op.drop_table('risk_assessments')
    op.drop_table('profitability_records')
    op.drop_table('price_predictions')
    op.drop_table('market_prices')
    op.drop_table('expenses')
