import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BodyProgressService, BodyProgressSummary, BodyRecord } from '../../services/body-progress.service';

@Component({
  selector: 'app-body-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './body-progress.component.html',
  styleUrl: './body-progress.component.css'
})
export class BodyProgressComponent implements OnInit {
  summary: BodyProgressSummary | null = null;
  loading = true;
  submitting = false;
  showForm = false;
  error = '';
  success = '';
  deletingId: number | null = null;

  // Form fields
  date = new Date().toISOString().split('T')[0];
  weight = 0;
  chest: number | null = null;
  waist: number | null = null;
  arms: number | null = null;
  legs: number | null = null;
  shoulders: number | null = null;

  constructor(
    private bodyProgressService: BodyProgressService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.bodyProgressService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitRecord(): void {
    if (!this.weight || this.weight <= 0) {
      this.error = 'Please enter a valid weight.';
      return;
    }
    this.submitting = true;
    this.error = '';

    const dto: any = {
      date: new Date(this.date).toISOString(),
      weight: Number(this.weight)
    };

    if (this.chest) dto.chest = Number(this.chest);
    if (this.waist) dto.waist = Number(this.waist);
    if (this.arms) dto.arms = Number(this.arms);
    if (this.legs) dto.legs = Number(this.legs);
    if (this.shoulders) dto.shoulders = Number(this.shoulders);

    this.bodyProgressService.addRecord(dto).subscribe({
      next: () => {
        this.success = 'Record saved successfully!';
        this.submitting = false;
        this.showForm = false;
        this.resetForm();
        this.loadSummary();
        setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to save record. Please try again.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRecord(id: number): void {
    if (!confirm('Delete this body record?')) return;
    this.deletingId = id;
    this.bodyProgressService.deleteRecord(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.loadSummary();
      },
      error: () => {
        this.deletingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.weight = 0;
    this.chest = null;
    this.waist = null;
    this.arms = null;
    this.legs = null;
    this.shoulders = null;
  }

  getBmiCategory(bmi: number): { label: string; class: string } {
    if (bmi < 18.5) return { label: 'Underweight', class: 'badge-blue' };
    if (bmi < 25) return { label: 'Normal weight', class: 'badge-green' };
    if (bmi < 30) return { label: 'Overweight', class: 'badge-orange' };
    return { label: 'Obese', class: 'badge-red' };
  }

  getWeightChangeClass(): string {
    if (!this.summary) return '';
    if (this.summary.weightChange > 0) return 'positive';
    if (this.summary.weightChange < 0) return 'negative';
    return 'neutral';
  }

  // SVG weight chart
  getChartPoints(): string {
    if (!this.summary || this.summary.history.length < 2) return '';
    const data = [...this.summary.history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const weights = data.map(d => d.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const w = 600; const h = 120;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.weight - minW) / (maxW - minW)) * h;
      return `${x},${y}`;
    });
    return points.join(' ');
  }

  getChartDots(): { x: number; y: number; weight: number; date: string }[] {
    if (!this.summary || this.summary.history.length < 2) return [];
    const data = [...this.summary.history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const weights = data.map(d => d.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const w = 600; const h = 120;
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((d.weight - minW) / (maxW - minW)) * h,
      weight: d.weight,
      date: d.date
    }));
  }

  hasAnyMeasurement(record: BodyRecord): boolean {
    return !!(record.chest || record.waist || record.arms || record.legs || record.shoulders);
  }
}