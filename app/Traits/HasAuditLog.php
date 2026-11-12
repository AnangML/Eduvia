<?php

namespace App\Traits;

use App\Actions\Audit\RecordAuditLog;

trait HasAuditLog
{
    public static function bootHasAuditLog(): void
    {
        static::created(function ($model) {
            app(RecordAuditLog::class)->execute(
                model: $model,
                event: 'created',
                oldValues: null,
                newValues: $model->getAttributes()
            );
        });

        static::updated(function ($model) {
            app(RecordAuditLog::class)->execute(
                model: $model,
                event: 'updated',
                oldValues: $model->getOriginal(),
                newValues: $model->getChanges()
            );
        });

        static::deleted(function ($model) {
            app(RecordAuditLog::class)->execute(
                model: $model,
                event: 'deleted',
                oldValues: $model->getOriginal(),
                newValues: null
            );
        });
    }
}
