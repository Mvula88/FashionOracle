# Fashion Oracle Edge Functions Deployment Script

Write-Host "🚀 Deploying Fashion Oracle Edge Functions to Supabase" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Link to Supabase project
Write-Host "📋 Step 1: Linking to your Supabase project..." -ForegroundColor Yellow
Write-Host "Project ref: ifyyxkwwmnbokjbqgsmi" -ForegroundColor White
Write-Host ""

npx supabase link --project-ref ifyyxkwwmnbokjbqgsmi

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link to Supabase project" -ForegroundColor Red
    Write-Host "Please make sure you have the correct database password: YYHVnNhafcgH05LB" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Step 2: Deploying Edge Functions..." -ForegroundColor Yellow
Write-Host ""

# Deploy analyze-image function
Write-Host "🔄 Deploying analyze-image function..." -ForegroundColor White
npx supabase functions deploy analyze-image

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ analyze-image deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy analyze-image" -ForegroundColor Red
}

Write-Host ""

# Deploy predict-trends function
Write-Host "🔄 Deploying predict-trends function..." -ForegroundColor White
npx supabase functions deploy predict-trends

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ predict-trends deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy predict-trends" -ForegroundColor Red
}

Write-Host ""

# Deploy collect-social-data function
Write-Host "🔄 Deploying collect-social-data function..." -ForegroundColor White
npx supabase functions deploy collect-social-data

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ collect-social-data deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy collect-social-data" -ForegroundColor Red
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set environment variables in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Test your functions using the URLs below:" -ForegroundColor White
Write-Host ""
Write-Host "   Image Analysis:" -ForegroundColor Cyan
Write-Host "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/analyze-image" -ForegroundColor White
Write-Host ""
Write-Host "   Trend Prediction:" -ForegroundColor Cyan
Write-Host "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/predict-trends" -ForegroundColor White
Write-Host ""
Write-Host "   Social Data Collection:" -ForegroundColor Cyan
Write-Host "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/collect-social-data" -ForegroundColor White
Write-Host ""
Write-Host "📖 See deploy-edge-functions.md for detailed instructions" -ForegroundColor Yellow